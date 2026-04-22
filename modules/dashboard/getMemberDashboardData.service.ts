import { prisma } from '@/prisma/prisma';
import type { MemberDashboardData } from './dashboard.types';
import ErrorManager from '@/managers/ErrorManager';
import { getGuildByName } from '../guild/services/getGuildByName.service';

export async function getMemberDashboardData(
    guildName: string,
    memberId: string
): Promise<MemberDashboardData> {
    try {
        console.log('guildeName:', guildName);
        const guild = await getGuildByName(guildName);
        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: 'GUILD_NOT_FOUND',
                message: 'Guilde non trouvée',
            });
        }
        const member = await prisma.member.findUnique({
            where: {
                id: memberId,
            },
            select: {
                id: true,
                guild_id: true,
                points_balance: true,
            },
        });
        if (!member) {
            throw ErrorManager.create({
                statusCode: 404,
                code: 'MEMBER_NOT_FOUND',
                message: 'Membre non trouvé',
            });
        }
        if (member.guild_id !== guild.id) {
            throw ErrorManager.create({
                statusCode: 403,
                code: 'MEMBER_NOT_IN_GUILD',
                message: "Le membre n'appartient pas à la guilde",
            });
        }
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const startOfNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        const interventions = await prisma.intervention.findMany({
            where: {
                guild_id: guild.id,
                OR: [
                    { worker_id: memberId },
                    { payer_id: memberId },
                ],
            },
            select: {
                id: true,
                worker_id: true,
                payer_id: true,
                status: true,
                created_at: true,
                used_tools: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const contestations = await prisma.contestation.findMany({
            where: {
                guild_id: guild.id,
                intervention: {
                    OR: [
                        { worker_id: memberId },
                        { payer_id: memberId },
                    ],
                },
            },
            select: {
                id: true,
                contester_id: true,
                status: true,
                created_at: true,
            },
        });
        const interventionsThisMonth = interventions.filter(
            (intervention) =>
                intervention.created_at >= startOfMonth &&
                intervention.created_at < startOfNextMonth
        );
        const asWorker = interventions.filter(
            (intervention) => intervention.worker_id === memberId
        ).length;
        const asPayer = interventions.filter(
            (intervention) => intervention.payer_id === memberId
        ).length;
        const pendingOtherValidation = interventions.filter(
            (intervention) =>
                intervention.worker_id === memberId &&
                intervention.status === 'DECLARE'
        ).length;
        const pendingMyValidation = interventions.filter(
            (intervention) =>
                intervention.payer_id === memberId &&
                intervention.status === 'DECLARE'
        ).length;
        const allTools = interventions.flatMap((intervention) => intervention.used_tools);
        const thisMonthTools = interventionsThisMonth.flatMap(
            (intervention) => intervention.used_tools
        );
        const uniqueTools = new Map<string, string>();
        for (const tool of allTools) {
            uniqueTools.set(tool.id, tool.name);
        }
        const uniqueThisMonthTools = new Set<string>();
        for (const tool of thisMonthTools) {
            uniqueThisMonthTools.add(tool.id);
        }
        const toolUsageCount = new Map<string, { name: string; count: number }>();
        for (const tool of allTools) {
            const existing = toolUsageCount.get(tool.id);
            if (existing) {
                existing.count += 1;
            } else {
                toolUsageCount.set(tool.id, {
                    name: tool.name,
                    count: 1,
                });
            }
        }
        const topTools = Array.from(toolUsageCount.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
        const contestationsThisMonth = contestations.filter(
            (contestation) =>
                contestation.created_at >= startOfMonth &&
                contestation.created_at < startOfNextMonth
        );
        const contestationsFromMe = contestations.filter(
            (contestation) => contestation.contester_id === memberId
        ).length;
        const pendingContestations = contestations.filter(
            (contestation) => contestation.status === 'EN_ATTENTE'
        ).length;
        return {
            pointsBalance: member.points_balance,
            interventions: {
                total: interventions.length,
                thisMonth: interventionsThisMonth.length,
                asWorker,
                pendingOtherValidation,
                asPayer,
                pendingMyValidation,
            },
            tools: {
                total: uniqueTools.size,
                thisMonth: uniqueThisMonthTools.size,
                top3: {
                    first: topTools[0]?.name ?? '',
                    second: topTools[1]?.name ?? '',
                    third: topTools[2]?.name ?? '',
                },
            },
            contestations: {
                total: contestations.length,
                thisMonth: contestationsThisMonth.length,
                fromMe: contestationsFromMe,
                pending: pendingContestations,
            },
        };
    } catch (error) {
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: 'MEMBER_DASHBOARD_DATA_ERROR',
            message:
                'Erreur lors de la récupération des données du tableau de bord membre',
        });
    }
}