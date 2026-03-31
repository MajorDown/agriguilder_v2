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
export async function refreshSession(accessToken: string, sessionToken: string): Promise<SessionOutput> {
    try {
        // VERIFICATION DE LA VALIDITE DU TOKEN DE SESSION
        const payload = TokenManager.decodeAccessToken(accessToken);
        if (!payload || !payload.sessionId) {
            throw ErrorManager.create({
                statusCode: 401,
                code: "INVALID_ACCESS_TOKEN",
                message: "Le token d'accès est invalide.",
            });
        }
        // VERIFICATION DE LA VALIDITE DE LA SESSION
        const session = await prisma.session.findUnique({
            where: {
                id: payload.sessionId,
            },
        });
        if (!session) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "SESSION_NOT_FOUND",
                message: "La session est introuvable.",
            });
        }
        // VERIFICATION DE LA VALIDITE DU TOKEN DE SESSION
        const session_token_hash = TokenManager.compareSessionToken(sessionToken, session.id);
        if (!session_token_hash) {
            throw ErrorManager.create({
                statusCode: 401,
                code: "INVALID_SESSION_TOKEN",
                message: "Le token de session est invalide.",
            });
        }
        // GENERATION DE NOUVEAUX TOKENS
        const newAccessToken = TokenManager.generateAccessToken({
            sessionId: session.id,
            accountId: session.user_id,
        });
        const newSessionToken = TokenManager.generateSessionToken();
        // MISE A JOUR DE LA SESSION EN BASE DE DONNEES
        await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                token_hash: newSessionToken.hashedSessionToken,
            },
        });
        return {
            accessToken: newAccessToken,
            sessionToken: newSessionToken.sessionToken,
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