import ErrorManager from "@/managers/ErrorManager";
import { UpdateUserEmailInput } from "../user.types";
import { checkUserPassword } from "./checkUserPassword.service";
import { prisma } from "@/prisma/prisma";

/**
 * @description Met à jour l'email d'un utilisateur
 * @param {UpdateUserEmailInput} input - Les infos pour mettre à jour l'email de l'utilisateur
 * @return {Promise<void>} Aucun résultat retourné, mais une erreur est levée en cas d'échec
 */
export async function updateUserEmail(input: UpdateUserEmailInput): Promise<void> {
    try {
        // ON VERIFIE QUE LE MOT DE PASSE ACTUEL EST CORRECT
        const isCurrentPasswordValid = await checkUserPassword(input.id, input.currentPassword);
        if (!isCurrentPasswordValid) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "INVALID_CURRENT_PASSWORD",
                message: "Le mot de passe actuel est incorrect",
            });
        }
        // ON VERIFIE QUE L'EMAIL N'EST PAS DEJA UTILISE PAR UN AUTRE UTILISATEUR
        const existingUserWithEmail = await prisma.user.findUnique({
            where: { email: input.newEmail },
        });
        if (existingUserWithEmail && existingUserWithEmail.id !== input.id) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "EMAIL_ALREADY_IN_USE",
                message: "L'email est déjà utilisé par un autre utilisateur",
            });
        }
        // ON VERIFIE QUE LE CODE DE VERIFICATION DE L'EMAIL N'EST PAS TROP VIEUX (20 MINUTES)
        const lastEmailVerification = await prisma.emailAuthCode.findFirst({
            where: { email: input.newEmail },
            orderBy: { created_at: 'desc' },
        });
        if (lastEmailVerification && lastEmailVerification.created_at > new Date(Date.now() - 20 * 60 * 1000)) {
            throw ErrorManager.create({
                statusCode: 400,
                code: 'CODE_VERIFICATION_TOO_OLD',
                message: "La dernière vérification d'email a été effectuée il y a moins de 20 minutes.",
            })
        }
        // ON MET A JOUR L'EMAIL DE L'UTILISATEUR
        await prisma.user.update({
            where: { id: input.id },
            data: { email: input.newEmail },
        });
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "UPDATE_USER_EMAIL_FAILED",
            message: "Echec de la mise à jour de l'email de l'utilisateur",
        });
    }
}