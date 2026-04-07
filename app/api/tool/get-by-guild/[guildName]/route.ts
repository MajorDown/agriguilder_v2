import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { getToolsByGuild } from "@/modules/tool/services/getToolsByGuild.service";

type RouteContext = {
    params: Promise<{
        guildName: string;
    }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { guildName } = await context.params;
        if (!guildName) {
            return ResponseManager.error({
                status: 400,
                code: "GUILD_NAME_MISSING",
                message: "Nom de guilde manquant",
            });
        }
        const { access_token } = await RequestManager.extract(request);
        if (!access_token) {
            return ResponseManager.error({
                status: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        TokenManager.verifyAccessToken(access_token);
        const tools = await getToolsByGuild(guildName);
        return ResponseManager.success(tools);
    } catch (error) {
        return ResponseManager.error(error);
    }
}