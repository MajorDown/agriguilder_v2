import { prisma} from "@/prisma/prisma";
import ErrorManager, { AppError} from "@/managers/ErrorManager";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";

export async function checkMemberByEmail(email: string, guildName: string) {
    try {
        // trouver le membre donc le user utilise cette adresse email et qui appartient à la guilde
        const guild = await getGuildByName(guildName);
        const member = await prisma.member.findFirst({
            where: {
                guild_id: guild.id,
                user: {
                    email: email,
                },
            },
        });
        // si le membre existe déjà au sein de la guilde, on refuse
        if (member) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "MEMBER_ALREADY_EXISTS",
                message: "Un membre avec cet email existe déjà dans cette guilde",
            });
        }
        // si le membre n'existe pas, mais qu'un user utilise bien cette adresse email, on retourne le User
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        // si le user en question est révoqué, on bloque
        if (user?.revoked_at) {
            throw ErrorManager.create({
                statusCode: 403,
                code: "USER_REVOKED",
                message: "L'utilisateur associé à cet email a été révoqué",
            });
        }
        if (user) {
            return {
                exists: true,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                society: user.society,
                phone: user.phone,
            };
        }
        return {
            exists: false,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw ErrorManager.create({
            statusCode: 500,
            code: "CHECK_MEMBER_BY_EMAIL_FAILED",
            message: "Erreur lors de la vérification du membre par email",
        })
    }
}