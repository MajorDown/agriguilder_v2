import { prisma } from "@/prisma/prisma";
import { InterventionStatus } from "@/prisma/generated/prisma/enums";
import ErrorManager from "@/managers/ErrorManager";
import { Prisma } from "@/prisma/generated/prisma/client";

type InterventionForPoints = {
    worker_id: string;
    payer_id: string;
    duration: number | null;
    surface: number | null;
    used_tools: {
        coef: number;
        unit: "HEURE" | "HECTARE";
    }[];
};

export function computeInterventionPoints(intervention: InterventionForPoints): number {
    return intervention.used_tools.reduce((sum, tool) => {
        if (tool.unit === "HECTARE") {
            return sum + ((intervention.surface ?? 0) * tool.coef);
        }

        return sum + ((intervention.duration ?? 0) * tool.coef);
    }, 0);
}

/**
 * @description recalcule et met à jour le solde de points d'un membre
 * @param memberId l'id du membre dont on veut recalculer le solde de points
 * @return le nouveau solde de points du membre
 */
export async function updateMemberPointsBalance(memberId: string): Promise<number> {
    const member = await prisma.member.findUnique({
        where: { id: memberId },
        select: {
            id: true,
            guild_id: true,
        },
    });

    if (!member) {
        throw ErrorManager.create({
            statusCode: 404,
            code: "MEMBER_NOT_FOUND",
            message: "Membre non trouvé",
        });
    }

    const lastReinitialization = await prisma.reinitialization.findFirst({
        where: {
            guild_id: member.guild_id,
        },
        orderBy: {
            created_at: "desc",
        },
        select: {
            created_at: true,
        },
    });

    const lastReinitializationDate = lastReinitialization?.created_at ?? null;

    const adjustmentWhere: Prisma.AdjustmentWhereInput = {
        guild_id: member.guild_id,
        member_id: member.id,
        ...(lastReinitializationDate && {
            created_at: {
                gt: lastReinitializationDate,
            },
        }),
    };

    const interventionWhere: Prisma.InterventionWhereInput = {
        guild_id: member.guild_id,
        status: InterventionStatus.VALIDEE,
        OR: [
            { worker_id: member.id },
            { payer_id: member.id },
        ],
        ...(lastReinitializationDate && {
            day: {
                gt: lastReinitializationDate,
            },
        }),
    };

    const [adjustments, interventions] = await Promise.all([
        prisma.adjustment.findMany({
            where: adjustmentWhere,
            select: {
                amount: true,
            },
        }),
        prisma.intervention.findMany({
            where: interventionWhere,
            select: {
                worker_id: true,
                payer_id: true,
                duration: true,
                surface: true,
                used_tools: {
                    select: {
                        coef: true,
                        unit: true,
                    },
                },
            },
        }),
    ]);

    const adjustmentsTotal = adjustments.reduce((sum, adjustment) => {
        return sum + adjustment.amount;
    }, 0);

    const interventionsTotal = interventions.reduce((sum, intervention) => {
        const points = computeInterventionPoints(intervention);

        if (intervention.worker_id === member.id) {
            return sum + points;
        }

        if (intervention.payer_id === member.id) {
            return sum - points;
        }

        return sum;
    }, 0);

    const pointsBalance = adjustmentsTotal + interventionsTotal;

    await prisma.member.update({
        where: {
            id: member.id,
        },
        data: {
            points_balance: pointsBalance,
        },
    });

    return pointsBalance;
}