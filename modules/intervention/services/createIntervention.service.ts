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
                    connect: input.tools.map(toolId => ({ id: toolId }))
                },
                description: input.description,
            }
        });
        await updateMemberPointsBalance(input.workerId);
        await updateMemberPointsBalance(input.payerId);
        return newIntervention;
    } catch (error) {
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "INTERVENTION_CREATION_FAILED",
            message: "La création de l'intervention a échoué",
        })
    }
}