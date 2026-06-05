import ErrorManager, { AppError } from "@/managers/ErrorManager";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";
import { prisma } from "@/prisma/prisma";
import type { CheckAdminByEmailResult } from "../admin.types";

export async function checkAdminByEmail(
    email: string,
    guildName: string
): Promise<CheckAdminByEmailResult> {
    try {
        const guild = await getGuildByName(guildName);

        const admin = await prisma.admin.findFirst({
            where: {
                guild_id: guild.id,
                user: {
                    email,
                },
                revoked_at: null,
            },
        });

        if (admin) {
            return {
                status: "ADMIN_ALREADY_EXISTS",
                message: "Un admin avec cet email existe déjà dans cette guilde",
            };
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user?.revoked_at) {
            throw ErrorManager.create({
                statusCode: 403,
                code: "USER_REVOKED",
                message: "L'utilisateur associé à cet email a été révoqué",
            });
        }

        if (user) {
            return {
                status: "USER_EXISTS",
                message: "Un utilisateur existe déjà avec cet email",
                user: {
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phone: user.phone,
                    society: user.society,
                },
            };
        }

        return {
            status: "USER_NOT_FOUND",
            message: "Aucun utilisateur existant avec cet email",
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw ErrorManager.create({
            statusCode: 500,
            code: "CHECK_ADMIN_BY_EMAIL_FAILED",
            message: "Erreur lors de la vérification de l'admin par email",
        });
    }
}
