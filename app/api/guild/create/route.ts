import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { CreateInterventionDto } from "@/modules/intervention/dto/CreateIntervention.dto";
import { verifyUserIsDev } from "@/modules/dev/services/verifyUserIsDev.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CreateInterventionDto);
        if (!access_token) {
            return ResponseManager.error({
                status: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        const payload = TokenManager.verifyAccessToken(access_token);
        await verifyUserIsDev(payload.accountId);

        return ResponseManager.success('ok');
    } catch (error) {
        return ResponseManager.error(error);
    }
}