import ErrorManager from "@/managers/ErrorManager";
import LogManager from "@/managers/LogManager";
import MailManager from "@/managers/MailManager";
import { CreateUserInput } from "../user.types";

/**
 * @description Envoie un mot de passe par email à l'utilisateur
 * @param {string} email - L'adresse email de l'utilisateur
 * @param {string} password - Le mot de passe à envoyer
 * @return {Promise<void>}
 */
export async function sendWelcomeByEmail(input: CreateUserInput): Promise<void> {
    try {
        await MailManager.send({
            to: input.email,
            subject: 'Bienvenue sur Agriguilder',
            html: /*html*/`
                <p>Bonjour ${input.firstname},</p>
                <p> Si vous recevez cet email, c'est que votre compte sur Agriguilder a été créé avec succès.</p>
                voici les informations que nous avons enregistrées pour votre compte :</p>
                <p><strong>Nom :</strong> ${input.firstname} ${input.lastname}</p>
                <p><strong>Prénom :</strong> ${input.firstname}</p>
                <p><strong>Société :</strong> ${input.society ?? 'non renseignée'}</p>
                <p><strong>Email :</strong> ${input.email}</p>
                <p><strong>Numéro de téléphone :</strong> ${input.phone}</p>
                <p>Votre mot de passe pour vous connecter à Agriguilder est :</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${input.password}</p>
                ${input.context === 'byAdmin' ? 
                    `<p>Ce mot de passe a été généré automatiquement au moment de la création de votre compte par un admin.<p>`
                    : ''}
                <p>(Vous pourrez le modifier à tout moment à votre guise dès votre prochaine connexion.)</p>
            `,
        });
        LogManager.info(`Mot de passe envoyé avec succès à : ${input.email}`);
        return;
    }
    catch (error) {
        LogManager.error(`Echec de l'envoi du mail de bienvenue à : 
            ${input.email} - ${error instanceof Error ? error.message : String(error)}`);
        throw ErrorManager.create({
            statusCode: 500,
            code: "EMAIL_WELCOME_SEND_FAILED",
            message: "Echec de l'envoi du mail de bienvenue",

        });
    }
}