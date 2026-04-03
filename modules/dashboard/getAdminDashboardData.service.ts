import { prisma } from '@/prisma/prisma';
import type { AdminDashBoardData} from './dashboard.types';
import ErrorManager from '@/managers/ErrorManager';

export async function getAdminDashboardData(guildName: string): Promise<AdminDashBoardData> {
    // récupérer l'id de la guilde à partir de son nom
    const guild = await prisma.guild.findFirst({
        where: { name: guildName },
        select: { id: true },
    });
    if (!guild) {
        throw ErrorManager.create({
            statusCode: 404,
            code: "GUILD_NOT_FOUND",
            message: "Guilde non trouvée",
        });
    }
    const guildId = guild.id;
    // récupérer la date de la dernière réinitialisation
    const lastReinitialization = await prisma.reinitialization.findFirst({
        where: { guild_id: guildId },
        orderBy: { created_at: 'desc' },
    });
    // récupérer le nombre total de membres de la guilde
    const totalmembers = await prisma.member.count({
        where: { guild_id: guildId },
    });
    const membersCreatedThisMonth = await prisma.member.count({
        where: {
            guild_id: guildId,
            created_at: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
        },
    });
    // récupérer le nombre d'interventions
    const interventions = await prisma.intervention.findMany({
        where: { guild_id: guildId },
        select: { 
            guild_id: true,
            worker_id: true,
            payer_id: true,
            status: true,
            created_at: true
        },
    });
    // calculer le nombre de membres concernés par les interventions
    const concernedMembersSet = new Set<string>();
    interventions.forEach(intervention => {
        concernedMembersSet.add(intervention.worker_id);
        concernedMembersSet.add(intervention.payer_id);
    });
    const concernedMembers = concernedMembersSet.size;
    const notValidatedInterventionsCount = interventions.filter(
        intervention => intervention.status !== 'VALIDEE' 
        && intervention.status !== 'ANNULEE')
        .length;
    // récupérer les contestation concernant la guilde
    const contestations = await prisma.contestation.findMany({
        where: { guild_id: guildId },
        select: {
            status: true,
            created_at: true
        }
    });
    const notTreatedContestationsCount = contestations.filter(
        contestation => contestation.status === 'EN_ATTENTE'
    ).length;
    // récupérer les outils
    const tools = await prisma.tool.findMany({
        where: { guild_id: guildId },
        select: {
            id: true,
            created_at: true,
            interventions: {
                select: {
                    id: true,
                    created_at: true,
                }
            }
        }
    });
    const usedToolsCount = tools.filter(tool => tool.interventions.length > 0).length;
    const toolsCreatedThisMonthCount = tools.filter(tool => 
        tool.created_at >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length;
    return {
        lastInit: lastReinitialization ? lastReinitialization.created_at.toISOString() : "",
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
            thisMonth: interventions.filter(intervention => 
                intervention.created_at >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length,
        },
        contestations: {
            total: contestations.length,
            pending: notTreatedContestationsCount,
            thisMonth: contestations.filter(contestation => 
                contestation.created_at >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length,
        }
    }
}
