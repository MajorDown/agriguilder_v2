import { prisma } from "@/prisma/prisma";
import PasswordManager from "@/managers/PasswordManager";
import ErrorManager from "@/managers/ErrorManager";

/**
 * @description Vérifie si le mot de passe fourni correspond à celui de l'utilisateur
 * @param {string} userId L'ID de l'utilisateur
 * @param {string} password Le mot de passe à vérifier
 * @return {Promise<boolean>} Vrai si le mot de passe est correct, faux sinon
 */
export async function checkUserPassword(userId: string, password: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "USER_NOT_FOUND",
                message: "Utilisateur introuvable",
            });
        }
        const isPasswordValid = await PasswordManager.compare(password, user.password_hash);
        return isPasswordValid;
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "CHECK_USER_PASSWORD_FAILED",
            message: "Échec de la vérification du mot de passe de l'utilisateur",
        });
    }
}