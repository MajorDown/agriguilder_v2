import {prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";

/**
 * @description Ferme une session en mettant à jour sa date de fin
 * @param {string} sessionId - L'ID de la session à fermer
 * @returns {Promise<void>} Une promesse qui se résout lorsque la session est fermée
 */
export async function closeSession(sessionId: string): Promise<void> {
    try {
        // ON VERIFIE SI LA SESSION EXISTE
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "SESSION_NOT_FOUND",
                message: "Session introuvable",
            });
        }
        await prisma.session.update({
            where: { id: sessionId },
            data: {
                ended_at: new Date(),
            }
        });
    } catch (error) {
        ErrorManager.create({
            statusCode: 500,
            code: "CLOSE_SESSION_ERROR",
            message: "Echec de la fermeture de la session.",
        });
    }

}