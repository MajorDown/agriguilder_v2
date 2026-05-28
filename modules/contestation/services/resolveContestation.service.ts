import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { ResolveContestationInput } from "../contestation.types";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";
import { updateMemberPointsBalance } from "@/modules/member/services/updateMemberPointsBalance.service";

export async function resolveContestation(input: ResolveContestationInput) {
    try {
        const guild = await getGuildByName(input.guildName);
        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: "Guilde non trouvée",
            });
        }

        if (input.status !== "ACCEPTEE" && input.status !== "REFUSEE") {
            throw ErrorManager.create({
                statusCode: 400,
                code: "INVALID_CONTESTATION_STATUS",
                message: "Statut de contestation invalide",
            });
        }

        const contestation = await prisma.contestation.findFirst({
            where: {
                id: input.contestationId,
                guild_id: guild.id,
            },
            include: {
                intervention: {
                    include: {
                        used_tools: true,
                    },
                },
            },
        });

        if (!contestation) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "CONTESTATION_NOT_FOUND",
                message: "Contestation non trouvée",
            });
        }

        if (contestation.status !== "EN_ATTENTE") {
            throw ErrorManager.create({
                statusCode: 400,
                code: "CONTESTATION_ALREADY_RESOLVED",
                message: "Cette contestation a déjà été résolue",
            });
        }

        const oldPayerId = contestation.intervention.payer_id;
        const workerId = contestation.intervention.worker_id;

        const tools = await prisma.tool.findMany({
            where: {
                id: {
                    in: input.tools,
                },
                guild_id: guild.id,
                is_active: true,
                revoked_at: null,
            },
            select: {
                id: true,
                unit: true,
            },
        });

        if (input.status === "ACCEPTEE" && tools.length !== input.tools.length) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "INVALID_TOOLS",
                message: "Un ou plusieurs outils sélectionnés sont invalides",
            });
        }

        const hasHectareTool = tools.some((tool) => tool.unit === "HECTARE");

        if (input.status === "ACCEPTEE" && hasHectareTool && (!input.surface || input.surface <= 0)) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "SURFACE_REQUIRED",
                message: "La surface est obligatoire pour les outils calculés à l'hectare",
            });
        }

        const resolvedContestation = await prisma.$transaction(async (tx) => {
            if (input.status === "ACCEPTEE") {
                await tx.intervention.update({
                    where: {
                        id: contestation.intervention_id,
                    },
                    data: {
                        payer_id: input.payerId,
                        day: new Date(input.day),
                        duration: input.duration,
                        surface: input.surface,
                        description: `${input.description} ~ maj suite à contestation le ${new Date().toLocaleDateString("fr-FR")}`,
                        status: "VALIDEE",
                        used_tools: {
                            set: tools.map((tool) => ({
                                id: tool.id,
                            })),
                        },
                    },
                });
            }

            if (input.status === "REFUSEE") {
                await tx.intervention.update({
                    where: {
                        id: contestation.intervention_id,
                    },
                    data: {
                        status: "VALIDEE",
                    },
                });
            }

            return tx.contestation.update({
                where: {
                    id: contestation.id,
                },
                data: {
                    status: input.status,
                    resolved_by_admin_id: input.adminId,
                    resolved_at: new Date(),
                },
            });
        });

        await updateMemberPointsBalance(workerId);
        await updateMemberPointsBalance(oldPayerId);

        if (oldPayerId !== input.payerId) {
            await updateMemberPointsBalance(input.payerId);
        }

        return resolvedContestation;
    } catch (error) {
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "RESOLVE_CONTESTATION_FAILED",
            message: "La résolution de la contestation a échoué",
        });
    }
}