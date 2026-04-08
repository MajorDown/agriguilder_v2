import { prisma } from "@/prisma/prisma";
import { CreateMemberInput, PublicMember } from "../member.types";
import ErrorManager, { AppError} from "@/managers/ErrorManager";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";
import PasswordManager from "@/managers/PasswordManager";
import { sendWelcomeByEmail } from "@/modules/user/services/sendWelcomeByEmail.service";
import { sendMemberCreationByEmail } from "./sendMemberCreationByEmail.service";
import LogManager from "@/managers/LogManager";

export async function createMember(input: CreateMemberInput): Promise<PublicMember> {
    try {
        const guild = await getGuildByName(input.guildName);

        const existingUser = await prisma.user.findUnique({
            where: {
                email: input.email,
            },
        });
        // si le user est révoqué, on bloque
        if (existingUser?.revoked_at) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "USER_REVOKED",
                message: "Cet utilisateur a été révoqué et ne peut pas être ajouté en tant que membre",
            });
        }
        // si le membre existe déjà au sein de la guilde, on bloque
        if (existingUser) {
            const existingMember = await prisma.member.findFirst({
                where: {
                    user_id: existingUser.id,
                    guild_id: guild.id,
                },
            });
            if (existingMember) {
                throw ErrorManager.create({
                    statusCode: 400,
                    code: "MEMBER_ALREADY_EXISTS",
                    message: "Un membre avec cet email existe déjà dans la guilde",
                });
            }
        }
        let user = existingUser;
        // si le user n'existe pas, on le crée
        if (!user) {
            const password = PasswordManager.generateRandom();
            const hashedPassword = await PasswordManager.hash(password);
            user = await prisma.user.create({
                data: {
                    email: input.email,
                    firstname: input.firstname,
                    lastname: input.lastname,
                    phone: input.phone,
                    society: input.society,
                    password_hash: hashedPassword,
                },
            });
            // envoi du mot de passe temporaire par email
            await sendWelcomeByEmail({
                email: input.email,
                firstname: input.firstname,
                lastname: input.lastname,
                phone: input.phone,
                society: input.society,
                password,
                context: "byAdmin",
            });
        }
        // création du membre
        const member = await prisma.member.create({
            data: {
                user_id: user.id,
                guild_id: guild.id,
            },
        });
        // notification d'ajout à la guilde
        await sendMemberCreationByEmail(user.email, input.guildName);
        return {
            id: member.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            society: user.society,
            points_balance: member.points_balance,
            created_at: member.created_at,
        };
    } catch (error) {
        LogManager.error(`Erreur : ${error}`);
        if (error instanceof AppError) {
            throw error;
        }
        throw ErrorManager.create({
            statusCode: 500,
            code: "MEMBER_CREATION_FAILED",
            message: "Échec de la création du membre",
        });
    }
}