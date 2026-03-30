import { NextRequest} from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import CreateSessionDto from "@/modules/session/dto/CreateSession.dto";
import { createSession } from "@/modules/session/services/createSession.service";

export async function POST(request: NextRequest) {
    try {
        const { dto, ip, user_agent } = await RequestManager.extract(request, CreateSessionDto);
        // CREATION DE LA SESSION
        const tokens = await createSession({
            email: dto.email,
            password: dto.password!,
            ipMask: ip,
            userAgent: user_agent,
        });
        return ResponseManager.createdAndNewAuthCookies({
            message: "Utilisateur connecté avec succès",
        }, tokens);
    }
    catch (error) {
        return ResponseManager.error(error);
    }
}