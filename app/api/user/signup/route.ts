import { NextRequest} from "next/server";
import RequestManager from "@/managers/RequestManager";
import ResponseManager from "@/managers/ResponseManager";
import { CreateUserDto } from "@/modules/user/dto/CreateUser.dto";
import { createUser } from "@/modules/user/services/createUser.service";
import { createSession } from "@/modules/session/services/createSession.service";

export async function POST(request: NextRequest) {
    try {
        const { dto, ip, user_agent } = await RequestManager.extract(request, CreateUserDto);
        // CREATION DU USER
        await createUser(dto);
        // CREATION DE LA SESSION
        const tokens = await createSession({
            email: dto.email,
            password: dto.password!,
            ipMask: ip,
            userAgent: user_agent,
        });
        return ResponseManager.createdAndNewAuthCookies({
            message: "Utilisateur créé avec succès",
        }, tokens);
    }
    catch (error) {
        return ResponseManager.error(error);
    }
}