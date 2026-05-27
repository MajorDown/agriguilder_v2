import { CreateInterventionInput } from "../intervention.types";
import ErrorManager from "@/managers/ErrorManager";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";
import { updateMemberPointsBalance } from "@/modules/member/services/updateMemberPointsBalance.service";
import { prisma } from "@/prisma/prisma";

export async function createIntervention(input: CreateInterventionInput) {
    try {
        const guild = await getGuildByName(input.guildName);

        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: "La guilde spécifiée est introuvable",
            });
        }

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

        if (tools.length !== input.tools.length) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "INVALID_TOOLS",
                message: "Un ou plusieurs outils sélectionnés sont invalides",
            });
        }

        const hasHectareTool = tools.some((tool) => tool.unit === "HECTARE");

        if (hasHectareTool && (!input.surface || input.surface <= 0)) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "SURFACE_REQUIRED",
                message: "La surface est obligatoire pour les outils calculés à l'hectare",
            });
        }

        const newIntervention = await prisma.intervention.create({
            data: {
                guild_id: guild.id,
                worker_id: input.workerId,
                payer_id: input.payerId,
                day: new Date(input.day),
                duration: input.duration,
                surface: input.surface,
                status: guild.max_validation_delay === 0 ? "VALIDEE" : "DECLARE",
                used_tools: {
                    connect: tools.map((tool) => ({
                        id: tool.id,
                    })),
                },
                description: input.description,
            },
        });

        await updateMemberPointsBalance(input.workerId);
        await updateMemberPointsBalance(input.payerId);

        return newIntervention;
    } catch (error) {
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "INTERVENTION_CREATION_FAILED",
            message: "La création de l'intervention a échoué",
        });
    }
}