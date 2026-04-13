import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { DeleteRuleDto } from "@/modules/rule/dto/DeleteRule.dto";
import { deleteRule } from "@/modules/rule/services/deleteRule.service";

export async function DELETE(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, DeleteRuleDto);
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
        await deleteRule({
            id: dto.id,
        });
        return ResponseManager.success({ message: "Règlement supprimé avec succès." });
    } catch (error) {
        return ResponseManager.error(error);
    }
}