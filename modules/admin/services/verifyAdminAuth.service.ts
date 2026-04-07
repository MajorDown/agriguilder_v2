import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { VerifyAdminAuthInput } from "../admin.types";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";

/**
 * @description Vérifie que l'utilisateur est bien un admin de la guilde
 * @param input Les données nécessaires à la vérification de l'authentification de l'admin
 * @throws Une erreur si l'utilisateur n'est pas un admin de la guilde ou si une erreur survient lors de la vérification
 * @return L'ID de l'admin si la vérification est réussie
 */
export async function verifyAdminAuth(input: VerifyAdminAuthInput): Promise<string> {
    try {
        const guildId = await getGuildByName(input.guildName);
        const isAdmin = await prisma.admin.findFirst({
            where: {
                guild_id: guildId.id,
                user_id: input.userId,
            }
        });
        if (!isAdmin) {
            throw ErrorManager.create({
                statusCode: 403,
                code: "FORBIDDEN",
                message: "Permissions insuffisantes pour effectuer cette action",
            });
        }
        return isAdmin.id;
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "VERIFY_ADMIN_AUTH_FAILED",
            message: "Échec de la vérification de l'authentification de l'admin",
        });
    }
}