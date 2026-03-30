import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';

class PasswordManager {
    private static readonly SALT_ROUNDS = 12;

    private static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    private static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private static readonly DIGITS = '0123456789';
    private static readonly SPECIALS = '!@#$%^&*()-_=+[]{}';

    private static readonly ALL_CHARS =
        PasswordManager.LOWERCASE +
        PasswordManager.UPPERCASE +
        PasswordManager.DIGITS +
        PasswordManager.SPECIALS;

    /**
     * @description Génère un hash bcrypt pour un mot de passe donné
     * @param {string} password - Le mot de passe à hasher
     * @returns {Promise<string>} Le hash bcrypt du mot de passe
     */
    static async hash(password: string): Promise<string> {
        if (!password) {
            throw new Error('PasswordManager.hash ~> password requis');
        }

        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * @description Compare un mot de passe en clair avec un hash bcrypt
     * @param {string} password - Le mot de passe en clair
     * @param {string} hash - Le hash bcrypt
     * @returns {Promise<boolean>} Résultat de la comparaison
     */
    static async compare(password: string, hash: string): Promise<boolean> {
        if (!password || !hash) {
            return false;
        }

        return bcrypt.compare(password, hash);
    }

 
    /**
     * @description Sélectionne un caractère aléatoire dans un ensemble de caractères
     * @param charset 
     * @returns 
     */
    private static randomChar(charset: string): string {
        const index = crypto.randomInt(0, charset.length);
        return charset[index];
    }
  
    /**
     * @description Mélange un tableau de chaînes de caractères
     * @param array 
     * @returns 
     */
    private static shuffle(array: string[]): string[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = crypto.randomInt(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * @description Génère un mot de passe aléatoire sécurisé
     * @param {number} length - La longueur du mot de passe (minimum 8)
     * @returns {string} Le mot de passe généré
     */
    static generateRandom(length = 10): string {
        if (length < 8) {
            throw new Error('PasswordManager.generateRandom ~> length trop court');
        }

        const requiredChars = [
            PasswordManager.randomChar(this.LOWERCASE),
            PasswordManager.randomChar(this.UPPERCASE),
            PasswordManager.randomChar(this.DIGITS),
        ];

        const remainingLength = length - requiredChars.length;
        const remainingChars = Array.from({ length: remainingLength }, () =>
            PasswordManager.randomChar(this.ALL_CHARS)
        );

        const passwordArray = [...requiredChars, ...remainingChars];

        return PasswordManager.shuffle(passwordArray).join('');
    }
}

export default PasswordManager;