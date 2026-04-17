import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { CreateContestationInput } from "../contestation.types";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";

export async function createContestation(input: CreateContestationInput) {
    try {
        const guild = await getGuildByName(input.guildName);
        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: "Guilde non trouvée",
            });
        }
        const contestation = await prisma.contestation.create({
            data: {
                intervention_id: input.interventionId,
                reason: input.reason,
                guild_id: guild.id,
                contester_id: input.contester_id,
            }
        });
        await prisma.intervention.update({
            where: { id: input.interventionId },
            data: { status: "CONTESTEE" },
        });
        return contestation;
    } catch (error) {
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "CREATE_CONTESTATION_FAILED",
            message: "La création de la contestation a échoué",
        })
    }
}