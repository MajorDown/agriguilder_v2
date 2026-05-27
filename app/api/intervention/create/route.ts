import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { CreateInterventionDto } from "@/modules/intervention/dto/CreateIntervention.dto";
import { createIntervention } from "@/modules/intervention/services/createIntervention.service";
import { verifyMemberAuth } from "@/modules/member/services/verifyMemberAuth.service";

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
        const memberId = await verifyMemberAuth({
            userId: payload.accountId,
            guildName: dto.guildName,
        });
        const newIntervention = await createIntervention({
            guildName: dto.guildName,
            workerId: memberId,
            payerId: dto.payerId,
            day: dto.day,
            duration: dto.duration,
            surface: dto.surface,
            tools: dto.tools,
            description: dto.description,
        });
        return ResponseManager.success(newIntervention);
    } catch (error) {
        return ResponseManager.error(error);
    }
}