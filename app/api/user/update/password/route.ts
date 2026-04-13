import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { UpdateUserPasswordDto } from "@/modules/user/dto/UpdateUserPassword.dto";
import { updateUserPassword } from "@/modules/user/services/updateUserPassword.service";

export async function PUT(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, UpdateUserPasswordDto);
        if (!access_token) {
            return ResponseManager.error({
                status: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        const payload = TokenManager.verifyAccessToken(access_token);
        await updateUserPassword({
            id: payload.accountId,
            newPassword: dto.newPassword,
            currentPassword: dto.currentPassword,
        })
        return ResponseManager.success(200);
    } catch (error) {
        return ResponseManager.error(error);
    }
}