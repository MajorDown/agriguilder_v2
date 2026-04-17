import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyMemberAuth } from "@/modules/member/services/verifyMemberAuth.service";
import { getInterventionsByMember } from "@/modules/intervention/services/getInterventionsByMember.service";

type RouteContext = {
    params: Promise<{
        guildName: string;
    }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { guildName } = await context.params;
        if (!guildName) {
            console.log("Guild name is missing in the request");
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
        const memberId = await verifyMemberAuth({
            userId: payload.accountId,
            guildName: guildName,
        });
        const interventions = await getInterventionsByMember(memberId);
        return ResponseManager.success(interventions);
    } catch (error) {
        return ResponseManager.error(error);
    }
}