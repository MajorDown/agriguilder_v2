import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { CreateFirstGuildAdminDto } from "@/modules/admin/dto/CreateFirstGuildAdmin.dto";
import { createFirstGuildAdmin } from "@/modules/admin/services/createFirstGuildAdmin.service";
import { verifyUserIsDev } from "@/modules/dev/services/verifyUserIsDev.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CreateFirstGuildAdminDto);

        if (!access_token) {
            return ResponseManager.error({
                statusCode: 401,
                code: "ACCESS_TOKEN_MISSING",
                message: "Token d'accès manquant",
            });
        }

        const payload = TokenManager.verifyAccessToken(access_token);
        await verifyUserIsDev(payload.accountId);

        const admin = await createFirstGuildAdmin({
            guildId: dto.guildId,
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
