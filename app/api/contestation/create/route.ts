import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { CreateContestationDto } from "@/modules/contestation/dto/CreateContestation.dto";
import { createContestation } from "@/modules/contestation/services/createContestation.service";
import { verifyMemberAuth } from "@/modules/member/services/verifyMemberAuth.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CreateContestationDto);
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
        const newContestation = await createContestation({
            interventionId: dto.interventionId,
            reason: dto.reason,
            guildName: dto.guildName,
            contester_id: memberId,
        })
        return ResponseManager.success(newContestation);
    } catch (error) {
        return ResponseManager.error(error);
    }
}