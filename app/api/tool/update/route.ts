import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { UpdateToolDto } from "@/modules/tool/dto/updateTool.dto";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { updateTool } from "@/modules/tool/services/updateTool.service";

export async function PUT(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, UpdateToolDto);
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
        const updatedTool = await updateTool(dto);
        return ResponseManager.success(updatedTool);
    } catch (error) {
        return ResponseManager.error(error);
    }
}