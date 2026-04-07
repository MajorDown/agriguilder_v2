import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { CreateToolDto } from "@/modules/tool/dto/createTool.dto";
import { createTool } from "@/modules/tool/services/createTool.service";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CreateToolDto);
        if (!access_token) {
            return ResponseManager.error({
                status: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        console.log("DTO reçu:", dto);
        const payload = TokenManager.verifyAccessToken(access_token);
        if (!payload) {
            return ResponseManager.error({
                status: 401,
                code: "INVALID_ACCESS_TOKEN",
                message: "Token d'accès invalide",
            });
        }
        await verifyAdminAuth({
            userId: payload.accountId,
            adminId: dto.adminId,
            guildName: dto.guildName,
        });
        const tools = await createTool(
            {
                name: dto.name,
                coef: dto.coef,
                guildName: dto.guildName,
                adminId: dto.adminId,
            }
        );
        return ResponseManager.success(tools);
    } catch (error) {
        return ResponseManager.error(error);
    }
}