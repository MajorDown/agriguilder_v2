import { prisma } from '@/prisma/prisma';
import type { AdminDashBoardData } from './dashboard.types';
import ErrorManager from '@/managers/ErrorManager';
import { getLastReinitializationDate } from '../reinitialization/services/getLastReinitializationDate.service';

export async function getAdminDashboardData(guildName: string): Promise<AdminDashBoardData> {
    const guild = await prisma.guild.findFirst({
        where: { name: guildName },
        select: {
            id: true,
            created_at: true,
        },
    });

    if (!guild) {
        throw ErrorManager.create({
            statusCode: 404,
            code: "GUILD_NOT_FOUND",
            message: "Guilde non trouvée",
        });
    }

    const guildId = guild.id;
    const lastReinitializationDate = await getLastReinitializationDate(guildId);

    const totalmembers = await prisma.member.count({
        where: {
            guild_id: guildId,
            revoked_at: null,
        },
    });

    const membersCreatedThisMonth = await prisma.member.count({
        where: {
            guild_id: guildId,
            revoked_at: null,
            created_at: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
        },
    });

    const interventions = await prisma.intervention.findMany({
        where: {
            guild_id: guildId,
            ...(lastReinitializationDate && {
                created_at: {
                    gt: lastReinitializationDate,
                },
            }),
        },
        select: {
            guild_id: true,
            worker_id: true,
            payer_id: true,
            status: true,
            created_at: true,
        },
    });

    const concernedMembersSet = new Set<string>();
    interventions.forEach((intervention) => {
        concernedMembersSet.add(intervention.worker_id);
        concernedMembersSet.add(intervention.payer_id);
    });

    const concernedMembers = concernedMembersSet.size;
    const notValidatedInterventionsCount = interventions.filter(
        (intervention) => intervention.status !== 'VALIDEE' && intervention.status !== 'ANNULEE'
    ).length;

    const contestations = await prisma.contestation.findMany({
        where: {
            guild_id: guildId,
            ...(lastReinitializationDate && {
                intervention: {
                    created_at: {
                        gt: lastReinitializationDate,
                    },
                },
            }),
        },
        select: {
            status: true,
            created_at: true,
        },
    });

    const notTreatedContestationsCount = contestations.filter(
        (contestation) => contestation.status === 'EN_ATTENTE'
    ).length;

    const tools = await prisma.tool.findMany({
        where: {
            guild_id: guildId,
            revoked_at: null,
        },
        select: {
            id: true,
            created_at: true,
            interventions: {
                where: {
                    ...(lastReinitializationDate && {
                        created_at: {
                            gt: lastReinitializationDate,
                        },
                    }),
                },
                select: {
                    id: true,
                    created_at: true,
                },
            },
        },
    });

    const usedToolsCount = tools.filter((tool) => tool.interventions.length > 0).length;
    const toolsCreatedThisMonthCount = tools.filter(
        (tool) => tool.created_at >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).length;

    return {
        lastInit: lastReinitializationDate
            ? lastReinitializationDate.toISOString()
            : guild.created_at.toISOString(),
        members: {
            total: totalmembers,
            actives: concernedMembers,
            thisMonth: membersCreatedThisMonth,
        },
        tools: {
            total: tools.length,
            used: usedToolsCount,
            thisMonth: toolsCreatedThisMonthCount,
        },
        interventions: {
            total: interventions.length,
            pending: notValidatedInterventionsCount,
            thisMonth: interventions.filter(
                (intervention) => intervention.created_at >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            ).length,
        },
        contestations: {
            total: contestations.length,
            pending: notTreatedContestationsCount,
            thisMonth: contestations.filter(
                (contestation) => contestation.created_at >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            ).length,
        },
    };
}
