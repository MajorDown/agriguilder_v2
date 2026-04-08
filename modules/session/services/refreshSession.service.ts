import { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import TokenManager from '@/managers/TokenManager';
import { SessionOutput } from '../session.types';

/**
 * @description Rafraîchit une session en vérifiant les tokens d'accès et de session, puis génère de nouveaux tokens si la session est valide.
 * @param {string | undefined} accessToken - Le token d'accès actuel de l'utilisateur.
 * @param {string} sessionToken - Le token de session actuel de l'utilisateur.
 * @return {Promise<SessionOutput>} Un objet contenant les nouveaux tokens d'accès et de session.
 */
export async function refreshSession(
    accessToken: string | undefined,
    sessionToken: string
): Promise<SessionOutput> {
    let sessionId: string | null = null;
    if (accessToken) {
        const payload = TokenManager.decodeAccessToken(accessToken);
        sessionId = payload?.sessionId ?? null;
    }
    if (!sessionId) {
        throw ErrorManager.create({
            statusCode: 401,
            code: "INVALID_ACCESS_TOKEN",
            message: "Le token d'accès est invalide.",
        });
    }
    const session = await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
    });
    if (!session) {
        throw ErrorManager.create({
            statusCode: 404,
            code: "SESSION_NOT_FOUND",
            message: "La session est introuvable.",
        });
    }
    const isValidSessionToken = TokenManager.compareSessionToken(
        sessionToken,
        session.token_hash
    );
    if (!isValidSessionToken) {
        throw ErrorManager.create({
            statusCode: 401,
            code: "INVALID_SESSION_TOKEN",
            message: "Le token de session est invalide.",
        });
    }
    const newAccessToken = TokenManager.generateAccessToken({
        sessionId: session.id,
        accountId: session.user_id,
    });
    const newSessionToken = TokenManager.generateSessionToken();
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

