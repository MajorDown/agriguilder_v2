import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { PublicUser } from "../user.types";

/**
 * @description Récupère un utilisateur par son email
 * @param {string} email - L'email de l'utilisateur à récupérer
 * @returns {Promise<PublicUser | null>} L'utilisateur correspondant à l'email, ou null s'il n'existe pas
 */
export async function getUserByEmail(email: string): Promise<PublicUser | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            society: user.society || '',
            phone: user.phone,
        };

    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "GET_USER_BY_EMAIL_FAILED",
            message: "Echec de la récupération de l'utilisateur par email",
        });
    }
}