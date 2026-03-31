import { NextRequest} from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import CreateSessionDto from "@/modules/session/dto/CreateSession.dto";
import { refreshSession } from "@/modules/session/services/refreshSession.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token, session_token } = await RequestManager.extract(request, CreateSessionDto);
        // CREATION DE LA SESSION
        const tokens = await refreshSession(access_token!, session_token!);
        return ResponseManager.createdAndNewAuthCookies({
            message: "Utilisateur connecté avec succès",
        }, tokens);
    }
    catch (error) {
        return ResponseManager.error(error);
    }
}