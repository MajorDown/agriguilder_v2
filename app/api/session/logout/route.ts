import { NextRequest} from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import { closeSession } from "@/modules/session/services/closeSession.service";

export async function POST(request: NextRequest) {
    try {
        const { access_token } = await RequestManager.extract(request);
        // FERMETURE DE LA SESSION
        await closeSession(access_token!);
        return ResponseManager.successAndClearAuthCookies({
            message: "Utilisateur déconnecté avec succès",
        });
    }
    catch (error) {
        return ResponseManager.error(error);
    }
}