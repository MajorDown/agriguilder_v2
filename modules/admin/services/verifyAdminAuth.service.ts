import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { VerifyAdminAuthInput } from "../admin.types";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";

/**
 * @description Vérifie que l'utilisateur est bien un admin de la guilde
 * @param input Les données nécessaires à la vérification de l'authentification de l'admin
 * @throws Une erreur si l'utilisateur n'est pas un admin de la guilde ou si une erreur survient lors de la vérification
 */
export async function verifyAdminAuth(input: VerifyAdminAuthInput): Promise<void> {
    try {
        const guildId = await getGuildByName(input.guildName);
        const isAdmin = await prisma.admin.findFirst({
            where: {
                id: input.adminId,
                guild_id: guildId.id,
                user_id: input.userId,
            }
        });
        if (!isAdmin) {
            throw ErrorManager.create({
                statusCode: 403,
                code: "FORBIDDEN",
                message: "Vous n'avez pas les permissions nécessaires pour effectuer cette action",
            });
        }
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "VERIFY_ADMIN_AUTH_FAILED",
            message: "Echec de la vérification de l'authentification de l'admin",
        });
    }
}