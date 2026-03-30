import { NextRequest } from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import CheckEmailAuthCodeDto from "@/modules/email-auth-code/dto/CheckEmailAuthCode.dto";
import { checkEmailAuthCode } from "@/modules/email-auth-code/services/checkEmailAuthCode.service";

/**
 * @description Route pour vérifier un code d'authentification par email.
 * @body { email: string, code: string, context: string }
 * @response 200 - Code d'authentification vérifié avec succès.
 */
export async function POST(request: NextRequest) {
    try {
        const { dto } =
            await RequestManager.extract(request, CheckEmailAuthCodeDto);
        const result = await checkEmailAuthCode(dto);
        return ResponseManager.success(
            result ?? {
                message: "Code d'authentification par email vérifié avec succès",
            }
        );
    } catch (error) {
        return ResponseManager.error(error);
    }
}