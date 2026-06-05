import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { CheckAdminByEmailDto } from "@/modules/admin/dto/CheckAdminByEmail.dto";
import { checkAdminByEmail } from "@/modules/admin/services/checkAdminByEmail.service";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CheckAdminByEmailDto);

        if (!access_token) {
            return ResponseManager.error({
                statusCode: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }

        const payload = TokenManager.verifyAccessToken(access_token);
        await verifyAdminAuth({
            userId: payload.accountId,
            guildName: dto.guildName,
        });

        const result = await checkAdminByEmail(dto.email.trim(), dto.guildName.trim());
        return ResponseManager.success(result);
    } catch (error) {
        return ResponseManager.error(error);
    }
}
