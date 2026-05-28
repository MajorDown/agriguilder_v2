import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { ResolveContestationDto } from "@/modules/contestation/dto/ResolveContestation.dto";
import { resolveContestation } from "@/modules/contestation/services/resolveContestation.service";

export async function PUT(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, ResolveContestationDto);
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
        const resolvedContestation = await resolveContestation({
            contestationId: dto.contestationId,
            guildName: dto.guildName,
            adminId: adminId,
            status: dto.status as "ACCEPTEE" | "REFUSEE",
            payerId: dto.payerId,
            day: dto.day,
            duration: dto.duration,
            surface: dto.surface,
            tools: dto.tools,
            description: dto.description,
        });
        return ResponseManager.success(resolvedContestation);
    } catch (error) {
        return ResponseManager.error(error);
    }
}