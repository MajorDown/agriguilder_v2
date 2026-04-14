import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { VerifyMemberAuthInput } from "../member.types";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";

/**
 * @description Vérifie que l'utilisateur est bien un membre de la guilde
 * @param input Les données nécessaires à la vérification de l'authentification du membre
 * @throws Une erreur si l'utilisateur n'est pas un membre de la guilde ou si une erreur survient lors de la vérification
 * @return L'ID du membre si la vérification est réussie
 */
export async function verifyMemberAuth(input: VerifyMemberAuthInput): Promise<string> {
    try {
        const guildId = await getGuildByName(input.guildName);
        const isMember = await prisma.member.findFirst({
            where: {
                guild_id: guildId.id,
                user_id: input.userId,
            }
        });
        if (!isMember) {
            throw ErrorManager.create({
                statusCode: 403,
                code: "FORBIDDEN",
                message: "Permissions insuffisantes pour effectuer cette action",
            });
        }
        return isMember.id;
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "VERIFY_MEMBER_AUTH_FAILED",
            message: "Échec de la vérification de l'authentification du membre",
        });
    }
}