import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { getInterventionsByGuild } from "@/modules/intervention/services/getInterventionsByGuild.service";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";

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
        const interventions = await getInterventionsByGuild(guildName);
        return ResponseManager.success(interventions);
    } catch (error) {
        return ResponseManager.error(error);
    }
}