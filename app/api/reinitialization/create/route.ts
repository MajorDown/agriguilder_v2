import { NextRequest, NextResponse } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import TokenManager from "@/managers/TokenManager";
import PdfManager from "@/managers/PdfManager";
import { verifyAdminAuth } from "@/modules/admin/services/verifyAdminAuth.service";
import { CreateReinitializationDto } from "@/modules/reinitialization/dto/CreateReinitialization.dto";
import { createReinitialization } from "@/modules/reinitialization/services/createReinitialization.service";

function formatFileDate(value: Date): string {
    const day = value.getDate().toString().padStart(2, "0");
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const year = value.getFullYear().toString().slice(-2);

    return `${day}.${month}.${year}`;
}

function encodeContentDispositionFileName(value: string): string {
    return encodeURIComponent(value).replace(/['()*]/g, (character) => {
        return `%${character.charCodeAt(0).toString(16).toUpperCase()}`;
    });
}

export async function POST(request: NextRequest) {
    try {
        const { access_token, dto } = await RequestManager.extract(request, CreateReinitializationDto);
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

        const result = await createReinitialization({
            guildName: dto.guildName,
            nextGuildName: dto.nextGuildName,
            city: dto.city,
            department: dto.department,
            humanHourPointValue: dto.humanHourPointValue,
            maxDeclarationDelay: dto.maxDeclarationDelay,
            maxValidationDelay: 0,
            maxContestationDelay: dto.maxContestationDelay,
            pointEuroValue: dto.pointEuroValue,
            confirm: dto.confirm,
            adminId,
        });

        const pdfBuffer = PdfManager.buildReinitializationReport(result.report);
        const fileDate = formatFileDate(result.createdAt);
        const asciiFileName = `Agriguilder - Rapport de Pre-reinitialisation de guilde - ${fileDate}.pdf`;
        const utf8FileName = `Agriguilder - Rapport de Pr\u00E9-r\u00E9initialisation de guilde - ${fileDate}.pdf`;

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${asciiFileName}"; filename*=UTF-8''${encodeContentDispositionFileName(utf8FileName)}`,
                "Content-Length": pdfBuffer.byteLength.toString(),
                "X-Reinitialization-Id": result.reinitializationId,
                "X-Updated-Guild-Name": result.guildName,
            },
        });
    } catch (error) {
        return ResponseManager.error(error);
    }
}

