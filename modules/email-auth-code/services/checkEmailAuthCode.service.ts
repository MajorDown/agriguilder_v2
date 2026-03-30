import LogManager from '@/managers/LogManager';
import ErrorManager from '@/managers/ErrorManager';
import CryptoManager from '@/managers/CryptoManager';
import { prisma } from '@/prisma/prisma';
import { CheckEmailAuthCodeInput } from '../email-auth-code.types';

/**
 * @description Vérifie un code d'authentification email
 * @param {string} email - L'adresse email de l'utilisateur
 * @param {string} code - Le code reçu par l'utilisateur
 * @param {EmailAuthCodeContext} context - Le contexte du code
 * @returns {Promise<void>}
 */
export async function checkEmailAuthCode(input: CheckEmailAuthCodeInput): Promise<void> {
    const emailAuthCode = await prisma.emailAuthCode.findFirst({
        where: {
            email: input.email,
            context: input.context,
            validated_at: null,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
    if (!emailAuthCode) {
        LogManager.error(`Aucun code d'authentification trouvé pour : ${input.email}`);
        throw ErrorManager.create({
            statusCode: 404,
            code: 'EMAIL_AUTH_CODE_NOT_FOUND',
            message: "Aucun code d'authentification trouvé",
        });
    }
    if (emailAuthCode.errors >= 5) {
        LogManager.error(`Code d'authentification verrouillé pour : ${input.email}`);
        throw ErrorManager.create({
            statusCode: 423,
            code: 'EMAIL_AUTH_CODE_LOCKED',
            message: "Le code d'authentification est verrouillé",
        });
    }
    const isValid = CryptoManager.verifyHmac(input.code, emailAuthCode.code_hash);
    if (!isValid) {
        const updatedEmailAuthCode = await prisma.emailAuthCode.update({
            where: {
                id: emailAuthCode.id,
            },
            data: {
                errors: {
                    increment: 1,
                },
            },
        });
        if (updatedEmailAuthCode.errors >= 5) {
            LogManager.error(`Code d'authentification verrouillé après trop d'erreurs pour : ${input.email}`);

            throw ErrorManager.create({
                statusCode: 423,
                code: 'EMAIL_AUTH_CODE_LOCKED',
                message: "Le code d'authentification est verrouillé",
            });
        }
        LogManager.error(
            `Code d'authentification invalide pour : ${input.email} | tentative ${updatedEmailAuthCode.errors}/5`
        );
        throw ErrorManager.create({
            statusCode: 400,
            code: 'EMAIL_AUTH_CODE_INVALID',
            message: "Code d'authentification invalide",
        });
    }
    await prisma.emailAuthCode.update({
        where: {
            id: emailAuthCode.id,
        },
        data: {
            validated_at: new Date(),
        },
    });
    LogManager.info(`Code d'authentification validé avec succès pour : ${input.email}`);
    return;
}