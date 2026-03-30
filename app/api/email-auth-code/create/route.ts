import { NextRequest, NextResponse } from "next/server";
import RequestManager from "@/managers/RequestManager";
import CreateEmailAuthCodeDto from "@/modules/email-auth-code/dto/CreateEmailAuthCode.dto";
import ResponseManager from "@/managers/ResponseManager";
import { createEmailAuthCode } from "@/modules/email-auth-code/services/createEmailAuthCode.service";

/**
 * @description Route pour créer un code d'authentification par email.
 * @body { email: string, context: string }
 * @response 201 - Code d'authentification créé avec succès.
 */
export async function POST(request: NextRequest) {
    try {
        const { dto } =
            await RequestManager.extract(request, CreateEmailAuthCodeDto);
        await createEmailAuthCode(dto);
        return ResponseManager.created({
            message: "Code d'authentification par email créé avec succès",
        });
    } catch (error) {
        return ResponseManager.error(error);
    }
}