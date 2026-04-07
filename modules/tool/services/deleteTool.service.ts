import  { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';

/**
 * @description Crée un nouvel outil pour une guilde
 * @param input Les données nécessaires à la création de l'outil
 * @return L'outil créé
 */
export async function deleteTool(toolId : string): Promise<void> {
    try {
        await prisma.tool.update({
            where: {
                id: toolId,
            },
            data: {
                revoked_at: new Date(),
            },
        });
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "DELETE_TOOL_FAILED",
            message: "Echec de la suppression de l'outil",
        });
    }
}
