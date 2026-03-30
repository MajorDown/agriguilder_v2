import crypto from 'crypto';

class CryptoManager {
    /**
     * @description Génère un HMAC pour une valeur donnée
     * @param {string} value - La valeur à hasher
     * @returns {string} Le HMAC de la valeur
     */
    static hmac(value: string): string {
        const HMAC_ALGORITHM = 'sha256'
        const secret = process.env.HMAC_SECRET;
        if (!value) {
            throw new Error('CryptoManager.hmac ~> value recquis');
        }

        if (!secret) {
            throw new Error('CryptoManager.hmac ~> secret recquis');
        }

        return crypto
            .createHmac(HMAC_ALGORITHM, secret)
            .update(value, 'utf8')
            .digest('hex');
    }

    /**
     * @description Vérifie si une valeur correspond à un HMAC donné
     * @param {string} value - La valeur à vérifier
     * @param {string} hash - Le HMAC à comparer
     * @returns {boolean} True si la valeur correspond au HMAC, sinon false
     */
    static verifyHmac(value: string, hash: string): boolean {
        const computed = this.hmac(value);
        return crypto.timingSafeEqual(
            Buffer.from(computed),
            Buffer.from(hash)
        );
    }

    /**
     * @description Génère un code d'authentification à 6 chiffres
     * @returns {string} Le code d'authentification généré
     */
    static generateAuthCode(): string {
        return crypto.randomInt(100000, 1000000).toString();
    }
}

export default CryptoManager;