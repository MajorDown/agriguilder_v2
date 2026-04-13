import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { UpdateUserInfosDto } from "@/modules/user/dto/UpdateUserInfos.dto";
import { updateUserInfos } from "@/modules/user/services/updateUserInfos.service";


export async function PUT(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, UpdateUserInfosDto);
        if (!access_token) {
            return ResponseManager.error({
                status: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }
        const payload = TokenManager.verifyAccessToken(access_token);
        await updateUserInfos({
            id: payload.accountId,
            firstname: dto.firstname,
            lastname: dto.lastname,
            phone: dto.phone,
            society: dto.society,
        });
        return ResponseManager.success(200);
    } catch (error) {
        return ResponseManager.error(error);
    }
}