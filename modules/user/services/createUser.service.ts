import { prisma } from "@/prisma/prisma";
import { CreateUserInput } from "../user.types";
import ErrorManager from "@/managers/ErrorManager";
import PasswordManager from "@/managers/PasswordManager";
import { sendWelcomeByEmail } from "./sendWelcomeByEmail.service";
import LogManager from "@/managers/LogManager";

/**
 * @description Crée un nouvel utilisateur
 * @param {CreateUserInput} input - Les informations nécessaires pour créer un utilisateur
 * @returns {Promise<User>} L'utilisateur créé
 */ 
export async function createUser(input: CreateUserInput): Promise<void> {
    try {
        // ON VERIFIE QUE L'UTILISATEUR N'EXISTE PAS DEJA AVEC CET EMAIL
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
        });
        if (existingUser) {
            throw ErrorManager.create({
                statusCode: 400,
                code: 'USER_ALREADY_EXISTS',
                message: 'Un utilisateur avec cet email existe déjà.',
            })
        }
        // ON VERIFIE QUE LE CODE DE VERIFICATION DE L'EMAIL N'EST PAS TROP VIEUX (20 MINUTES)
        const lastEmailVerification = await prisma.emailAuthCode.findFirst({
            where: { email: input.email },
            orderBy: { created_at: 'desc' },
        });
        if (lastEmailVerification && lastEmailVerification.created_at > new Date(Date.now() - 20 * 60 * 1000)) {
            throw ErrorManager.create({
                statusCode: 400,
                code: 'CODE_VERIFICATION_TOO_OLD',
                message: "La dernière vérification d'email a été effectuée il y a moins de 20 minutes.",
            })
        }
        // SI LE MOT DE PASSE N'EST PAS RENSEIGNE, ON VERIFIE SI LE CONTEXT EST "BY_ADMIN"
        if (!input.password) {
            if (input.context !== 'selfSignUp') {
                throw ErrorManager.create({
                    statusCode: 400,
                    code: 'PASSWORD_REQUIRED_FOR_ADMIN_CREATION',
                    message: "Le mot de passe est requis pour la création d'un utilisateur par un admin.",
                })
            }
            // SI LE MOT DE PASSE N'EST PAS RENSEIGNE ET QUE LE CONTEXT EST "BY_ADMIN", ON GENERE UN MOT DE PASSE TEMPORAIRE
            const temporaryPassword = PasswordManager.generateRandom();
            input.password = temporaryPassword;
        }
        // ON CREE L'UTILISATEUR
        const hashedPassword = await PasswordManager.hash(input.password!);
        const newUser = await prisma.user.create({
            data: {
                email: input.email,
                password_hash: hashedPassword,
                firstname: input.firstname,
                lastname: input.lastname,
                society: input.society,
                phone: input.phone,
                created_at: new Date()
            },
        });
        // ON ENVOI LE MAIL DE BIENVENUE
        await sendWelcomeByEmail({
            email: newUser.email,
            password: input.password,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            phone: newUser.phone,
            society: newUser.society ?? '',
            context: input.context,
        });
    }
    catch (error) {
        LogManager.error(`Echec de la création de l'utilisateur: ${error}`);
        throw ErrorManager.create({
            statusCode: 500,
            code: 'CREATE_USER_FAILED',
            message: "Echec de la création de l'utilisateur",
        })
    }
    return;
}