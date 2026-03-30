import ErrorManager from "@/managers/ErrorManager";
import LogManager from "@/managers/LogManager";
import MailManager from "@/managers/MailManager";

/**
 * @description Envoie un mot de passe par email à l'utilisateur
 * @param {string} email - L'adresse email de l'utilisateur
 * @param {string} password - Le mot de passe à envoyer
 * @return {Promise<void>}
 */
export async function sendPasswordByEmail(email: string, password: string): Promise<void> {
    try {
        await MailManager.send({
            to: email,
            subject: 'Agriguilder - votre nouveau mot de passe',
            html: /*html*/`
                <p>Bonjour,</p>
                <p>Votre nouveau mot de passe pour vous connecter àAgriguilder est :</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${password}</p>
                <p>Vous pourrez le modifier à tout moment à votre guise dès votre prochaine connexion.</p>
            `,
            text: `Votre mot de passe temporaire est: ${password}`,
        });
        LogManager.info(`Mot de passe envoyé avec succès à : ${email}`);
        return;
    }
    catch (error) {
        LogManager.error(`Echec de l'envoi du mot de passe à : 
            ${email} - ${error instanceof Error ? error.message : String(error)}`);
        throw ErrorManager.create({
            statusCode: 500,
            code: "EMAIL_PASSWORD_SEND_FAILED",
            message: "Echec de l'envoi du mot de passe",

        });
    }
}