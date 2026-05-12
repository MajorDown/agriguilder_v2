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
        const payload = TokenManager.verifyAccessToken(access_token);
        const adminId = await verifyAdminAuth({
            userId: payload.accountId,
            guildName: dto.guildName,
        });
        const newTool = await createTool(
            {
                name: dto.name,
                coef: dto.coef,
                unit: dto.unit,
                guildName: dto.guildName,
                adminId: adminId,
            }
        );
        return ResponseManager.success(newTool);
    } catch (error) {
        return ResponseManager.error(error);
    }
}