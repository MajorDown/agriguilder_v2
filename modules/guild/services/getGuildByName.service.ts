import { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import { Guild } from '@/prisma/generated/prisma/client';

/**
 * @description Récupère une guilde par son nom
 * @param guildName Le nom de la guilde à récupérer
 * @return La guilde correspondante au nom fourni
 */
export async function getGuildByName(guildName: string): Promise<Guild> {
    try {
        const guild = await prisma.guild.findUnique({
            where: { name: guildName }
        });
        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: "Guilde introuvable",
            });
        }
        return guild;
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "GET_GUILD_BY_NAME_FAILED",
            message: "Echec de la récupération de la guilde",
        });
    }
}