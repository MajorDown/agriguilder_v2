import ErrorManager, { AppError } from "@/managers/ErrorManager";
import LogManager from "@/managers/LogManager";
import PasswordManager from "@/managers/PasswordManager";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";
import { sendWelcomeByEmail } from "@/modules/user/services/sendWelcomeByEmail.service";
import { prisma } from "@/prisma/prisma";
import type { CreateAdminInput, CreatedAdmin } from "../admin.types";

export async function createAdmin(input: CreateAdminInput): Promise<CreatedAdmin> {
    let temporaryPassword: string | null = null;

    try {
        const guild = await getGuildByName(input.guildName);

        const existingUser = await prisma.user.findUnique({
            where: {
                email: input.email,
            },
        });

        if (existingUser?.revoked_at) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "USER_REVOKED",
                message: "Cet utilisateur a été révoqué et ne peut pas devenir admin",
            });
        }

        if (existingUser) {
            const existingAdmin = await prisma.admin.findFirst({
                where: {
                    user_id: existingUser.id,
                    guild_id: guild.id,
                    revoked_at: null,
                },
            });

            if (existingAdmin) {
                throw ErrorManager.create({
                    statusCode: 400,
                    code: "ADMIN_ALREADY_EXISTS",
                    message: "Un admin avec cet email existe déjà dans cette guilde",
                });
            }
        }

        if (!existingUser) {
            temporaryPassword = PasswordManager.generateRandom();
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = existingUser ?? await tx.user.create({
                data: {
                    email: input.email,
                    firstname: input.firstname,
                    lastname: input.lastname,
                    phone: input.phone,
                    society: input.society,
                    password_hash: await PasswordManager.hash(temporaryPassword!),
                },
            });

            const admin = await tx.admin.upsert({
                where: {
                    guild_id_user_id: {
                        guild_id: guild.id,
                        user_id: user.id,
                    },
                },
                update: {
                    revoked_at: null,
                },
                create: {
                    guild_id: guild.id,
                    user_id: user.id,
                },
            });

            return {
                id: admin.id,
                userId: user.id,
                guildId: guild.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                phone: user.phone,
                society: user.society,
            };
        });

        if (temporaryPassword) {
            await sendWelcomeByEmail({
                email: result.email,
                firstname: result.firstname,
                lastname: result.lastname,
                phone: result.phone,
                society: result.society ?? undefined,
                password: temporaryPassword,
                context: "byAdmin",
            });
        }

        return result;
    } catch (error) {
        LogManager.error(`Échec de la création de l'admin: ${error}`);

        if (error instanceof AppError) {
            throw error;
        }

        throw ErrorManager.create({
            statusCode: 500,
            code: "CREATE_ADMIN_FAILED",
            message: "Échec de la création de l'admin",
        });
    }
}
