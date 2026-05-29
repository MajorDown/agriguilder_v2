import { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import { Guild } from '@/prisma/generated/prisma/client';

/**
 * @description Récupère toutes les guildes
 * @return La liste des guildes
 */
export async function getAllGuild(): Promise<Guild[]> {
    try {
        const guilds = await prisma.guild.findMany();
        return guilds;
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "GET_ALL_GUILDS_FAILED",
            message: "Echec de la récupération des guildes",
        });
    }
}