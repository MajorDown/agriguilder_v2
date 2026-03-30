import LogManager from '@/managers/LogManager';
import ErrorManager from '@/managers/ErrorManager';
import CryptoManager from '@/managers/CryptoManager';
import { prisma } from '@/prisma/prisma';
import { sendEmailAuthCode } from './sendEmailAuthCode.service';
import { CreateEmailAuthCodeInput } from '../email-auth-code.types';

/**
 * @description Crée un code d'authentification par email pour l'utilisateur et l'envoie
 * @param {string} email - L'adresse email de l'utilisateur
 * @returns {Promise<void>}
 */
export async function createEmailAuthCode(input: CreateEmailAuthCodeInput): Promise<void> {
    let createdAuthCodeId: string | null = null;
    try {
        const code = CryptoManager.generateAuthCode();
        const codeHash = CryptoManager.hmac(code);
        const createdAuthCode = await prisma.emailAuthCode.create({
            data: {
                email: input.email,
                code_hash: codeHash,
                context: input.context,
            },
        });
        LogManager.info(`Code d'authentification créé pour : ${input.email}`);
        createdAuthCodeId = createdAuthCode.id;
        await sendEmailAuthCode(input.email, code);
        LogManager.info(`Code d'authentification envoyé avec succès pour : ${input.email}`);
        return;
    } catch (error) {
        if (createdAuthCodeId) {
            try {
                await prisma.emailAuthCode.delete({
                    where: { id: createdAuthCodeId },
                });
            } catch (deleteError) {
                LogManager.error(
                    `Échec de suppression du code d'authentification après erreur pour : ${input.email} | ${
                        deleteError instanceof Error ? deleteError.message : String(deleteError)
                    }`
                );
            }
        }

        LogManager.error(
            `Échec de la création/envoi du code d'authentification pour : ${input.email} | ${
                error instanceof Error ? error.message : String(error)
            }`
        );
        throw ErrorManager.create({
            code: 'EMAIL_AUTH_CODE_CREATION_FAILED',
            message: "Échec de la création du code d'authentification",
        });
    }
}