import ErrorManager, { AppError } from "@/managers/ErrorManager";
import PasswordManager from "@/managers/PasswordManager";
import LogManager from "@/managers/LogManager";
import { sendWelcomeByEmail } from "@/modules/user/services/sendWelcomeByEmail.service";
import { prisma } from "@/prisma/prisma";
import type { CreateFirstGuildAdminInput, CreatedFirstGuildAdmin } from "../admin.types";

export async function createFirstGuildAdmin(
    input: CreateFirstGuildAdminInput
): Promise<CreatedFirstGuildAdmin> {
    let temporaryPassword: string | null = null;

    try {
        const guild = await prisma.guild.findUnique({
            where: {
                id: input.guildId,
            },
            select: {
                id: true,
                name: true,
                admins: {
                    where: {
                        revoked_at: null,
                    },
                    select: {
                        id: true,
                    },
                    take: 1,
                },
            },
        });

        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: "Guilde introuvable",
            });
        }

        if (guild.admins.length > 0) {
            throw ErrorManager.create({
                statusCode: 409,
                code: "FIRST_ADMIN_ALREADY_EXISTS",
                message: "Cette guilde possède déjà un premier admin",
            });
        }

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
        LogManager.error(`Échec de la création du premier admin: ${error}`);

        if (error instanceof AppError) {
            throw error;
        }

        throw ErrorManager.create({
            statusCode: 500,
            code: "CREATE_FIRST_GUILD_ADMIN_FAILED",
            message: "Échec de la création du premier admin",
        });
    }
}
