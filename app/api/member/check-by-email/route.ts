import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { CheckMemberByEmailDto } from "@/modules/member/dto/CheckMemberByEmail.dto";
import { checkMemberByEmail } from "@/modules/member/services/checkMemberByEmail.service";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CheckMemberByEmailDto);
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
        const result = await checkMemberByEmail(dto.email, dto.guildName);
        return ResponseManager.success(result);
    } catch (error) {
        console.error("Error in check-by-email route:", error);
        return ResponseManager.error(error);
    }
}