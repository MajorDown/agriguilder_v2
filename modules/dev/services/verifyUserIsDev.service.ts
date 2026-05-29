import { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import LogManager from '@/managers/LogManager';

/**
 * @description Vérifie si l'utilisateur est un développeur
 * @param {string} userId - L'ID de l'utilisateur à vérifier
 * @throws {Error} Si l'utilisateur n'est pas trouvé ou n'est pas un développeur
 * @returns {Promise<void>} - Résout si l'utilisateur est un développeur, sinon rejette avec une erreur
 */
export async function verifyUserIsDev(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw ErrorManager.create({
                message: 'utilisateur non trouvé',
                statusCode: 404,
                code: 'USER_NOT_FOUND',
            });
        }
        const isDev = await prisma.dev.findUnique({
            where: {
                user_id: user.id,
            },
        });
        if (!isDev) {
            throw ErrorManager.create({
                message: "l'utilisateur n'est pas un développeur",
                statusCode: 403,
                code: 'USER_NOT_DEV',
            });
        }
    } catch (error) {
        LogManager.error(`verifyUserIsDev - erreur: ${error}`);
        throw ErrorManager.throwOrCreate(error, {
            message: "echec de la vérification du statut de développeur de l'utilisateur",
            statusCode: 500,
            code: 'VERIFY_USER_IS_DEV_ERROR',
        });
    }
}