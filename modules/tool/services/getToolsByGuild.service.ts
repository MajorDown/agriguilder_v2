import  { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import { PublicTool } from '../tool.types';
import { getGuildByName } from '@/modules/guild/services/getGuildByName.service';

/**
 * @description Récupère les dernières version des outils d'une guilde
 */
export async function getToolsByGuild(guildName: string): Promise<PublicTool[]> {
    try {
        const guild = await getGuildByName(guildName);
        const guildTools = await prisma.tool.findMany({
            where: { 
                guild_id: guild.id,
                revoked_at: null 
            },
            select: {
                id: true,
                name: true,
                coef: true,
                is_active: true,
                version: true
            }
        })
        return guildTools;
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "GET_TOOLS_BY_GUILD_FAILED",
            message: "Echec de la récupération des outils de la guilde",
        });
    }
}
