import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import { refreshSession } from "@/modules/session/services/refreshSession.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, session_token } = await RequestManager.extract(request);
        if (!access_token ||!session_token) {
            return ResponseManager.error({
                status: 401,
                code: "SESSION_TOKEN_MISSING",
                message: "Token de session manquant",
            });
        }
        const tokens = await refreshSession(access_token, session_token);
        return ResponseManager.createdAndNewAuthCookies(
            {
                message: "Session rafraîchie avec succès",
            },
            tokens
        );
    } catch (error) {
        return ResponseManager.error(error);
    }
}