import { NextRequest} from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import CreateSessionDto from "@/modules/session/dto/CreateSession.dto";
import { createSession } from "@/modules/session/services/createSession.service";
import LogManager from "@/managers/LogManager";

export async function POST(request: NextRequest) {
    try {
        const { dto, ip, user_agent } = await RequestManager.extract(request, CreateSessionDto);
        console.log("DTO extrait de la requête :", dto);
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
        LogManager.error(`Erreur lors de la connexion du user : ${error}`);
        return ResponseManager.error(error);
    }
}