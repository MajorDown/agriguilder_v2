import { prisma } from "@/prisma/prisma";
import { updateMemberPointsBalance } from "@/modules/member/services/updateMemberPointsBalance.service";
import ErrorManager from "@/managers/ErrorManager";

export type UpdateGuildMembersPointsBalanceResult = {
    guildId: string;
    guildName: string;
    recalculatedMembersCount: number;
};

export async function updateGuildMembersPointsBalance(
    guildId: string
): Promise<UpdateGuildMembersPointsBalanceResult> {
    const guild = await prisma.guild.findUnique({
        where: { id: guildId },
        select: {
            id: true,
            name: true,
            members: {
                where: {
                    revoked_at: null,
                },
                select: {
                    id: true,
                },
            },
        },
    });

    if (!guild) {
        throw ErrorManager.create({
            statusCode: 404,
            code: "GUILD_NOT_FOUND",
            message: "Guilde non trouvée",
        })
    }

    for (const member of guild.members) {
        await updateMemberPointsBalance(member.id);
    }

    return {
        guildId: guild.id,
        guildName: guild.name,
        recalculatedMembersCount: guild.members.length,
    };
}