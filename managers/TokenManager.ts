import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import CryptoManager from './CryptoManager';
import { AccountType } from '@/src/types/global.types';


export type AccessTokenPayload = {
    accountId: string;
    sessionId: string;
    type?: AccountType;
};

export type RefreshTokenGeneration = {
    refreshToken: string;
    hashedRefreshToken: string;
};

class TokenManager {
    private static readonly ACCESS_TOKEN_SECRET: jwt.Secret = process.env.JWT_SECRET ?? '';
    private static readonly ACCESS_TOKEN_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.ACCESS_TOKEN_TTL as SignOptions['expiresIn']) ?? '15m';

    /**
     * @description Génère un access token JWT signé
     * @param {AccessTokenPayload} payload - Le payload à inclure dans le token
     * @returns {string} Le token JWT signé
     */
    static generateAccessToken(payload: AccessTokenPayload): string {
        if (!this.ACCESS_TOKEN_SECRET) {
            throw new Error('TokenManager.generateAccessToken ~> JWT_SECRET manquant');
        }

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
        if (!this.ACCESS_TOKEN_SECRET) {
            throw new Error('TokenManager.verifyAccessToken ~> JWT_SECRET manquant');
        }

        const decoded = jwt.verify(
            token,
            this.ACCESS_TOKEN_SECRET
        ) as JwtPayload;

        return {
            accountId: decoded.accountId as string,
            sessionId: decoded.sessionId as string,
            type: decoded.type as AccountType,
        };
    }

    /**
     * @description Décode un access token JWT sans le vérifier
     * @param {string} token - Le token JWT à décoder
     * @returns {JwtPayload} Le payload décodé
     */
    static decodeAccessToken(token: string): JwtPayload {
        return jwt.decode(token) as JwtPayload;
    }

    /**
     * @description Génère une paire de refresh token (clair + hashé)
     * @returns {RefreshTokenGeneration} La paire de refresh token (clair + hashé)
     */
    static generateRefreshToken(): RefreshTokenGeneration {
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const hashedRefreshToken = CryptoManager.hmac(refreshToken);

        return {
            refreshToken,
            hashedRefreshToken,
        };
    }

    /**
     * @description Compare un refresh token en clair avec son hash stocké
     * @param {string} refreshToken - Le refresh token en clair
     * @param {string} storedHash - Le hash stocké du refresh token
     * @returns {boolean} Résultat de la comparaison
     */
    static compareRefreshToken(refreshToken: string, storedHash: string): boolean {
        if (!refreshToken) {
          throw new Error('TokenManager.compareRefreshToken ~> refreshToken requis');
        }
        if (!storedHash) {
          throw new Error('TokenManager.compareRefreshToken ~> storedHash requis');
        }
        const computedHash = CryptoManager.hmac(refreshToken);
        return crypto.timingSafeEqual(
            Buffer.from(computedHash, 'hex'),
            Buffer.from(storedHash, 'hex')
        );
    }

}

export default TokenManager;