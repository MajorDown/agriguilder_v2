import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { CreateRuleDto } from "@/modules/rule/dto/CreateRule.dto";
import { createRule } from "@/modules/rule/services/createRule.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CreateRuleDto);
        if (!access_token) {
            return ResponseManager.error({
                status: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        const payload = TokenManager.verifyAccessToken(access_token);
        const adminId = await verifyAdminAuth({
            userId: payload.accountId,
            guildName: dto.guildName,
        });
        const newRule = await createRule({
            content: dto.content,
            guildName: dto.guildName,
            adminId: adminId,
        });
        return ResponseManager.success(newRule);
    } catch (error) {
        return ResponseManager.error(error);
    }
}