import  { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import { getGuildByName } from '@/modules/guild/services/getGuildByName.service';
import { CreateToolInput, PublicTool } from '../tool.types';
import LogManager from '@/managers/LogManager';

/**
 * @description Crée un nouvel outil pour une guilde
 * @param input Les données nécessaires à la création de l'outil
 * @return L'outil créé
 */
export async function createTool(input: CreateToolInput): Promise<PublicTool> {
    try {
        const guild = await getGuildByName(input.guildName);
        const newTool = await prisma.tool.create({
            data: {
                name: input.name,
                coef: input.coef,
                guild_id: guild.id,
                admin_id: input.adminId,
            }
        });
        LogManager.info(`Nouvel outil créé: ${JSON.stringify(newTool)}`);
        return newTool;
    } catch (error) {
        LogManager.error(`Echec de la création de l'outil: ${error}`);
        throw ErrorManager.create({
            statusCode: 500,
            code: "CREATE_TOOL_FAILED",
            message: "Echec de la création de l'outil",
        });
    }
}
