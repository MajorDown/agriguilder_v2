import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyUserIsDev } from "@/modules/dev/services/verifyUserIsDev.service";
import { getAllGuild } from "@/modules/guild/services/getAllGuild.service";

export async function GET(request: NextRequest) {
    try {
        const { access_token } = await RequestManager.extract(request);
        if (!access_token) {
            return ResponseManager.error({
                status: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        const payload = await TokenManager.verifyAccessToken(access_token);
        await verifyUserIsDev(payload.accountId);
        const guilds = await getAllGuild();
        return ResponseManager.success(guilds);
    } catch (error) {
        return ResponseManager.error(error);
    }
}