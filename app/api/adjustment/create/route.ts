import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { CreateAdjustmentDto } from "@/modules/adjustment/dto/CreateAdjustment.dto";
import { createAdjustmentService } from "@/modules/adjustment/services/createAdjustment.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CreateAdjustmentDto);
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
        const newAdjustment = await createAdjustmentService({
            guildName: dto.guildName,
            memberId: dto.memberId,
            adminId: adminId,
            amount: dto.amount,
            reason: dto.reason,
            type: dto.type,
        });
        return ResponseManager.success(newAdjustment);
    } catch (error) {
        return ResponseManager.error(error);
    }
}