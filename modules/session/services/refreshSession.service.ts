import { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import TokenManager from '@/managers/TokenManager';
import { SessionOutput } from '../session.types';

/**
 * @description Rafraîchit une session en générant un nouveau token de session
 * @param sessionId - L'ID de la session à rafraîchir.
 * @returns Un objet contenant le nouveau token d'accès et le token de session.
 * @throws Une erreur si le rafraîchissement de la session échoue.
 */
export async function refreshSession(sessionId: string): Promise<SessionOutput> {
    const maxSessionDuration: number  = 24 * 60 * 60 * 1000 * Number(process.env.SESSION_TOKEN_TTL_DAYS); // 30 jours en ms
    try {
        const { sessionToken, hashedSessionToken } = TokenManager.generateSessionToken();
        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data: {
                token_hash: hashedSessionToken,
            },
        });
        const accessToken = TokenManager.generateAccessToken({
            sessionId: updatedSession.id,
            accountId: updatedSession.user_id,
        });
        return {
            accessToken,
            sessionToken,
        };
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code : "REFRESH_SESSION_ERROR",
            message: "Echec du rafraichissement de la session."
        })
    }
}