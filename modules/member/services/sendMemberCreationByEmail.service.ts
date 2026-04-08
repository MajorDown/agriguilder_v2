import ErrorManager from "@/managers/ErrorManager";
import LogManager from "@/managers/LogManager";
import MailManager from "@/managers/MailManager";

/**
 * @description Envoie une notification par email à l'utilisateur lors de la création de son compte
 * @param {string} email - L'adresse email de l'utilisateur
 * @param {string} guildName - Le nom de la guilde
 * @return {Promise<void>}
 */
export async function sendMemberCreationByEmail(email: string, guildName: string): Promise<void> {
    try {
        await MailManager.send({
            to: email,
            subject: `Agriguilder - Bienvenue au sein de la guilde ${guildName}`,
            html: /*html*/`
                <p>Bonjour,</p>
                <p>Votre compte a été intégré avec succès au sein de la guilde ${guildName}.</p>
                <p>Vous pouvez dors et déjà commencer à explorer les fonctionnalités disponibles.</p>
            `,
            text: `Votre compte a été intégré avec succès au sein de la guilde ${guildName}.`,
        });
        LogManager.info(`Notification de création de compte envoyée avec succès à : ${email}`);
        return;
    }
    catch (error) {
        LogManager.error(`Echec de l'envoi de la notification à : 
            ${email} - ${error instanceof Error ? error.message : String(error)}`);
        throw ErrorManager.create({
            statusCode: 500,
            code: "EMAIL_NOTIFICATION_SEND_FAILED",
            message: "Echec de l'envoi de la notification",

        });
    }
}