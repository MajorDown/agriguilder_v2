import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { CreateAdminDto } from "@/modules/admin/dto/CreateAdmin.dto";
import { createAdmin } from "@/modules/admin/services/createAdmin.service";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CreateAdminDto);

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

        const admin = await createAdmin({
            guildName: dto.guildName.trim(),
            email: dto.email.trim(),
            firstname: dto.firstname.trim(),
            lastname: dto.lastname.trim(),
            phone: dto.phone.trim(),
            society: dto.society?.trim() || undefined,
        });

        return ResponseManager.created(admin);
    } catch (error) {
        return ResponseManager.error(error);
    }
}
