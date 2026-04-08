import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { toggleTool } from "@/modules/tool/services/toggleTool.service";
import { ToggleToolDto } from "@/modules/tool/dto/ToggleTool.dto";

export async function PUT(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, ToggleToolDto);
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
        const result = await toggleTool(dto);
        return ResponseManager.success(result);
    } catch (error) {
        return ResponseManager.error(error);
    }
}