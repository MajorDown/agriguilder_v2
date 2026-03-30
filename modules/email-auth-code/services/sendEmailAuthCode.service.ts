import ErrorManager from "@/managers/ErrorManager";
import LogManager from "@/managers/LogManager";
import MailManager from "@/managers/MailManager";

/**
 * @description Envoie un code d'authentification par email à l'utilisateur
 * @param {string} email - L'adresse email de l'utilisateur
 * @param {string} code - Le code d'authentification à envoyer
 * @return {Promise<void>}
 */
export async function sendEmailAuthCode(email: string, code: string): Promise<void> {
    try {
        await MailManager.send({
            to: email,
            subject: 'Verification de votre adresse email',
            html: /*html*/`
                <p>Bonjour,</p>
                <p>Votre code de verification pour Agriguilder est :</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${code}</p>
                <p>Vous pouvez utiliser ce code pour vérifier votre adresse email. 
                Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
                <p>Ce code est personnel et expire rapidement.</p>
            `,
            text: `Votre code de verification est: ${code}`,
        });
        LogManager.info(`Code d'authentification envoyé avec succès à : ${email}`);
        return;
    }
    catch (error) {
        LogManager.error(`Echec de l'envoi du code d'authentification à : 
            ${email} - ${error instanceof Error ? error.message : String(error)}`);
        throw ErrorManager.create({
            code: "EMAIL_AUTH_CODE_SEND_FAILED",
            message: "Echec de l'envoi du code d'authentification",
        });
    }
}