import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { UpdateRuleDto } from "@/modules/rule/dto/UpdateRuleDto";
import { updateRule } from "@/modules/rule/services/updateRule.service";

export async function PUT(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, UpdateRuleDto);
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
            guildName: dto.guildName,
        });
        const updatedRule = await updateRule({
            content: dto.content,
            id: dto.id,
        });
        return ResponseManager.success(updatedRule);
    } catch (error) {
        return ResponseManager.error(error);
    }
}