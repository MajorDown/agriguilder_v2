import { prisma } from '@/prisma/prisma';
import TokenManager, { AccessTokenPayload} from '@/managers/TokenManager';
import ErrorManager from '@/managers/ErrorManager';

export async function checkAccessToken(accessToken: string): Promise<AccessTokenPayload> {
    const payload = TokenManager.verifyAccessToken(accessToken);

    const session = await prisma.session.findUnique({
        where: { id: payload.sessionId },
    });

    if (!session) {
        throw ErrorManager.create({
            statusCode: 401,
            code: 'SESSION_NOT_FOUND',
            message: 'Session introuvable',
        });
    }

    if (session.user_id !== payload.accountId) {
        throw ErrorManager.create({
            statusCode: 401,
            code: 'SESSION_USER_MISMATCH',
            message: 'Session invalide pour cet utilisateur',
        });
    }

    if (session.expires_at < new Date()) {
        throw ErrorManager.create({
            statusCode: 401,
            code: 'SESSION_EXPIRED',
            message: 'Session expirée',
        });
    }

    if (session.revoked_at) {
        throw ErrorManager.create({
            statusCode: 401,
            code: 'SESSION_REVOKED',
            message: 'Session révoquée',
        });
    }

    if (session.ended_at) {
        throw ErrorManager.create({
            statusCode: 401,
            code: 'SESSION_CLOSED',
            message: 'Session clôturée',
        });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.accountId },
    });

    if (!user) {
        throw ErrorManager.create({
            statusCode: 401,
            code: 'USER_NOT_FOUND',
            message: 'Utilisateur introuvable',
        });
    }

    if (user.revoked_at) {
        throw ErrorManager.create({
            statusCode: 401,
            code: 'USER_REVOKED',
            message: 'Utilisateur révoqué',
        });
    }

    return payload;
}