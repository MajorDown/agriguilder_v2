import  { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import { PublicTool } from '../tool.types';

/**
 * @description Récupère les dernières version des outils d'une guilde
 */
export async function getToolsByGuild(guildName: string): Promise<PublicTool[]> {
    try {
        const guild = await prisma.guild.findFirst({
            where: { name: guildName }
        });
        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: "Guilde introuvable",
            });
        }
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
