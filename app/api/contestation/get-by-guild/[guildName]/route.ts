import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { getContestationsByGuild } from "@/modules/contestation/services/getContestationsByGuild.service";

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
        const payload = TokenManager.verifyAccessToken(access_token);
        await verifyAdminAuth({
            userId: payload.accountId,
            guildName: guildName,
        });

        const contestations = await getContestationsByGuild(guildName);
        return ResponseManager.success(contestations);
    } catch (error) {
        return ResponseManager.error(error);
    }
}