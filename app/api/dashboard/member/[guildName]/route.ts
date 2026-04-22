import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { getMemberDashboardData } from "@/modules/dashboard/getMemberDashboardData.service";
import { verifyMemberAuth } from "@/modules/member/services/verifyMemberAuth.service";
import LogManager from "@/managers/LogManager";

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
                status: 400,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        const payload = TokenManager.verifyAccessToken(access_token);
        const memberId = await verifyMemberAuth({
            userId: payload.accountId,
            guildName: guildName,
        });
        const dashboardData = await getMemberDashboardData(guildName, memberId);
        return ResponseManager.success({
            status: 200,
            code: "DASHBOARD_DATA_RETRIEVED",
            message: "Données du tableau de bord récupérées avec succès",
            data: dashboardData,
        });
    } catch (error) {
        console.log(error)
        return ResponseManager.error(error);
    }
}