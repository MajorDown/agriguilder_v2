import jwt, {
    JwtPayload,
    SignOptions,
    TokenExpiredError,
    JsonWebTokenError,
    NotBeforeError,
} from 'jsonwebtoken';
import crypto from 'crypto';
import CryptoManager from './CryptoManager';
import ErrorManager from './ErrorManager';

export type AccessTokenPayload = {
    accountId: string;
    sessionId: string;
};

export type SessionTokenGeneration = {
    sessionToken: string;
    hashedSessionToken: string;
};

class TokenManager {
    private static readonly ACCESS_TOKEN_SECRET: jwt.Secret =
        process.env.JWT_SECRET ?? '';
    private static readonly ACCESS_TOKEN_EXPIRES_IN: SignOptions['expiresIn'] =
        (process.env.ACCESS_TOKEN_TTL as SignOptions['expiresIn']) ?? '15m';

    /**
     * @description Vérifie que JWT_SECRET est bien défini
     */
    private static assertAccessTokenSecret(): void {
        if (!this.ACCESS_TOKEN_SECRET) {
            throw ErrorManager.create({
                statusCode: 500,
                code: 'JWT_SECRET_MISSING',
                message: 'JWT_SECRET manquant',
            });
        }
    }

    /**
     * @description Vérifie que la valeur correspond bien au payload attendu
     * @param {unknown} value
     * @returns {boolean}
     */
    private static isAccessTokenPayload(value: unknown): value is AccessTokenPayload {
        if (!value || typeof value !== 'object') {
            return false;
        }
        const payload = value as Record<string, unknown>;
        return (
            typeof payload.accountId === 'string' &&
            payload.accountId.trim().length > 0 &&
            typeof payload.sessionId === 'string' &&
            payload.sessionId.trim().length > 0
        );
    }

    /**
     * @description Génère un access token JWT signé
     * @param {AccessTokenPayload} payload - Le payload à inclure dans le token
     * @returns {string} Le token JWT signé
     */
    static generateAccessToken(payload: AccessTokenPayload): string {
        this.assertAccessTokenSecret();
        const options: SignOptions = {
            expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
        };
        return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, options);
    }

    /**
     * @description Vérifie et décode un access token JWT signé
     * @param {string} token - Le token JWT à vérifier
     * @returns {AccessTokenPayload} Le payload décodé
     */
    static verifyAccessToken(token: string): AccessTokenPayload {
        this.assertAccessTokenSecret();
        if (!token) {
            throw ErrorManager.create({
                statusCode: 401,
                code: 'ACCESS_TOKEN_REQUIRED',
                message: 'Access token requis',
            });
        }
        let decoded: string | JwtPayload;
        try {
            decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw ErrorManager.create({
                    statusCode: 401,
                    code: 'ACCESS_TOKEN_EXPIRED',
                    message: 'Access token expiré',
                });
            }

            if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
                throw ErrorManager.create({
                    statusCode: 401,
                    code: 'INVALID_ACCESS_TOKEN',
                    message: 'Access token invalide',
                });
            }
            throw error;
        }

        if (!this.isAccessTokenPayload(decoded)) {
            throw ErrorManager.create({
                statusCode: 401,
                code: 'INVALID_ACCESS_TOKEN_PAYLOAD',
                message: 'Payload du access token invalide',
            });
        }
        return decoded;
    }

    /**
     * @description Décode un access token JWT sans le vérifier
     * @param {string} token - Le token JWT à décoder
     * @returns {JwtPayload | null} Le payload décodé
     */
    static decodeAccessToken(token: string): JwtPayload | null {
        const decoded = jwt.decode(token);
        if (!decoded || typeof decoded === 'string') {
            return null;
        }
        return decoded as JwtPayload;
    }

    /**
     * @description Génère une paire de session token (clair + hashé)
     * @returns {SessionTokenGeneration} La paire de session token (clair + hashé)
     */
    static generateSessionToken(): SessionTokenGeneration {
        const sessionToken = crypto.randomBytes(64).toString('hex');
        const hashedSessionToken = CryptoManager.hmac(sessionToken);
        return {
            sessionToken,
            hashedSessionToken,
        };
    }

    /**
     * @description Compare un session token en clair avec son hash stocké
     * @param {string} sessionToken - Le session token en clair
     * @param {string} storedHash - Le hash stocké du session token
     * @returns {boolean} Résultat de la comparaison
     */
    static compareSessionToken(sessionToken: string, storedHash: string): boolean {
        if (!sessionToken) {
            throw ErrorManager.create({
                statusCode: 400,
                code: 'SESSION_TOKEN_REQUIRED',
                message: 'Session token requis',
            });
        }
        if (!storedHash) {
            throw ErrorManager.create({
                statusCode: 400,
                code: 'STORED_HASH_REQUIRED',
                message: 'Hash du session token requis',
            });
        }

        const computedHash = CryptoManager.hmac(sessionToken);
        return crypto.timingSafeEqual(
            Buffer.from(computedHash, 'hex'),
            Buffer.from(storedHash, 'hex')
        );
    }
}

export default TokenManager;