import {prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import TokenManager from "@/managers/TokenManager";
import { CreateSessionInput, SessionOutput } from "../session.types";
import { getUserByEmail } from "@/modules/user/services/getUserByEmail.service";
import { checkUserPassword } from "@/modules/user/services/checkUserPassword.service";

/**
 * @description Crée une session pour un utilisateur donné et génère les tokens d'accès et de session
 * @param {CreateSessionInput} input - Les informations nécessaires pour créer la session
 * @returns {Promise<SessionOutput>} Les tokens générés pour la session créée
 */
export async function createSession(input: CreateSessionInput): Promise<SessionOutput> {
    try {
        console.log("Tentative de création de session pour l'email :", input.email);
        // ON VERIFIE QUE LE USER EXISTE
        const user = await getUserByEmail(input.email);
        if (!user) {
            throw ErrorManager.create({
                statusCode: 404,
                code : "USER_NOT_FOUND",
                message: "Utilisateur introuvable",
            })
        }
        // ON VERIFIE LE MOT DE PASSE
        await checkUserPassword(user.id, input.password);
        // ON CREE LA SESSION
        const { sessionToken, hashedSessionToken } = TokenManager.generateSessionToken();
        const newSession =await prisma.session.create({
            data: {
                user_id: user.id,
                token_hash: hashedSessionToken,
                ip_mask: input.ipMask,
                user_agent: input.userAgent,
                expires_at: 
                    new Date(Date.now() + 24 * 60 * 60 * 1000 * Number(process.env.SESSION_TOKEN_TTL_DAYS)), // 30 jours
            }
        });
        // ON RENVOI LES TOKENS
        const accessToken = TokenManager.generateAccessToken({ 
            accountId: user.id,
            sessionId: newSession.id,
        });
        return {
            sessionToken,
            accessToken
        };
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code : "CREATE_SESSION_ERROR",
            message: "Echec de la création de la session.",
        })
    }
}
