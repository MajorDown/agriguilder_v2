import { prisma } from "@/prisma/prisma";
import {
    updateGuildMembersPointsBalance,
    type UpdateGuildMembersPointsBalanceResult,
} from "@/modules/guild/services/updateGuildPointsBalances.service";
import ErrorManager from "@/managers/ErrorManager";

export type UpdateAllGuildsMembersPointsBalanceSuccess = {
    guildId: string;
    guildName: string;
    recalculatedMembersCount: number;
};

export type UpdateAllGuildsMembersPointsBalanceFailure = {
    guildId: string;
    guildName: string;
    errorMessage: string;
};

export type UpdateAllGuildsMembersPointsBalanceResult = {
    totalGuilds: number;
    successCount: number;
    failureCount: number;
    successes: UpdateAllGuildsMembersPointsBalanceSuccess[];
    failures: UpdateAllGuildsMembersPointsBalanceFailure[];
};

export async function updateAllGuildsMembersPointsBalance(): Promise<UpdateAllGuildsMembersPointsBalanceResult> {
    const guilds = await prisma.guild.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    const successes: UpdateAllGuildsMembersPointsBalanceSuccess[] = [];
    const failures: UpdateAllGuildsMembersPointsBalanceFailure[] = [];

    for (const guild of guilds) {
        try {
            const result: UpdateGuildMembersPointsBalanceResult =
                await updateGuildMembersPointsBalance(guild.id);

            successes.push({
                guildId: result.guildId,
                guildName: result.guildName,
                recalculatedMembersCount: result.recalculatedMembersCount,
            });
        } catch (error) {
            const err = ErrorManager.throwOrCreate(error, {
                statusCode: 500,
                code: "GUILD_POINTS_UPDATE_FAILED",
                message: "La mise à jour des points des membres de la guilde a échoué",
            });
            failures.push({
                guildId: guild.id,
                guildName: guild.name,
                errorMessage: err instanceof Error ? err.message : "Erreur inconnue",
            });
        }
    }

    return {
        totalGuilds: guilds.length,
        successCount: successes.length,
        failureCount: failures.length,
        successes,
        failures,
    };
}