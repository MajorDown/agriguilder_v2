import { prisma } from "@/prisma/prisma";
import { UpdateUserPasswordInput } from "../user.types";
import ErrorManager from "@/managers/ErrorManager";
import { checkUserPassword } from "./checkUserPassword.service";
import PasswordManager from "@/managers/PasswordManager";

/**
 * @description Met à jour le mot de passe d'un utilisateur
 * @param {UpdateUserPasswordInput} input - Les infos pour mettre à jour le mot de passe de l'utilisateur
 * @returns {Promise<void>} Aucun résultat retourné, mais une erreur est levée en cas d'échec
 */
export async function updateUserPassword(input: UpdateUserPasswordInput): Promise<void> {
    try {
        // ON VERIFIE QUE L'UTILISATEUR A BIEN FOURNI SON MOT DE PASSE ACTUEL
        const isCurrentPasswordValid = await checkUserPassword(input.id, input.currentPassword);
        if (!isCurrentPasswordValid) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "INVALID_CURRENT_PASSWORD",
                message: "Le mot de passe actuel est incorrect",
            });
        }
        // ON MET A JOUR LE MOT DE PASSE DE L'UTILISATEUR
        const hashedNewPassword = await PasswordManager.hash(input.newPassword);
        await prisma.user.update({
            where: { id: input.id },
            data: { password_hash: hashedNewPassword },
        });
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "UPDATE_USER_PASSWORD_FAILED",
            message: "Echec de la mise à jour du mot de passe de l'utilisateur",
        });
    }
}