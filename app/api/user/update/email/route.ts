import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { UpdateUserEmailDto } from "@/modules/user/dto/UpdateUserEmail.dto";
import { updateUserEmail } from "@/modules/user/services/updateUserEmail.service";


export async function PUT(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, UpdateUserEmailDto);
        if (!access_token) {
            return ResponseManager.error({
                status: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        const payload = TokenManager.verifyAccessToken(access_token);
        await updateUserEmail({
            id: payload.accountId,
            newEmail: dto.newEmail,
            currentPassword: dto.currentPassword,
        })
        return ResponseManager.success(200);
    } catch (error) {
        return ResponseManager.error(error);
    }
}