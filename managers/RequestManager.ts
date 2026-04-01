import { NextRequest } from "next/server";
import CookiesManager from "./CookiesManager";
import ErrorManager from "./ErrorManager";
import { DTO } from "./DtoManager";

type RequestTokens = {
    access_token: string | null;
    session_token: string | null;
    device_id: string | null;
};

type RequestClient = {
    ip: string;
    user_agent: string;
};

type RequestExtractWithDtoResult<T> = RequestTokens &
    RequestClient & {
        dto: T;
        param: string | null;
    };

type RequestExtractWithoutDtoResult = RequestTokens &
    RequestClient & {
        dto: null;
        param: string | null;
    };

class RequestManager {
    private static getTokensFromCookies(request: NextRequest): RequestTokens {
        return {
            access_token: CookiesManager.getAccessToken(request),
            session_token: CookiesManager.getSessionToken(request),
            device_id: CookiesManager.getDeviceId(request),
        };
    }

    private static getClientInfo(request: NextRequest): RequestClient {
        const xForwardedFor = request.headers.get("x-forwarded-for");
        const xRealIp = request.headers.get("x-real-ip");

        let ip = "unknown";

        if (xForwardedFor) {
            ip = xForwardedFor.split(",")[0].trim();
        } else if (xRealIp) {
            ip = xRealIp.trim();
        }

        const userAgent = request.headers.get("user-agent")?.trim() || "unknown";

        return {
            ip,
            user_agent: userAgent,
        };
    }

    private static async getRequestDto<T extends DTO>(
        request: NextRequest,
        DtoClass: new (data: unknown) => T
    ): Promise<T> {
        if (request.method === "GET" || request.method === "HEAD") {
            throw ErrorManager.create({
                message: "Cette requête ne peut pas contenir de body",
                statusCode: 400,
                code: "BODY_NOT_ALLOWED",
            });
        }

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            throw ErrorManager.create({
                message: "Le body de la requête n'est pas un JSON valide",
                statusCode: 400,
                code: "INVALID_JSON",
            });
        }

        if (
            body === null ||
            body === undefined ||
            (typeof body === "string" && body.trim() === "")
        ) {
            throw ErrorManager.create({
                message: "Le body de la requête est requis",
                statusCode: 400,
                code: "MISSING_BODY",
            });
        }

        return Object.assign(new DtoClass(body), body);
    }

    private static getParamFromRequest(
        request: NextRequest,
        paramKey?: string,
        routeParams?: Record<string, string>
    ): string | null {
        if (!paramKey) {
            return null;
        }

        const fromRoute = routeParams?.[paramKey];
        if (fromRoute) {
            return fromRoute;
        }

        const fromQuery = request.nextUrl.searchParams.get(paramKey);
        if (fromQuery) {
            return fromQuery;
        }

        return null;
    }

    static async extract<T extends DTO>(
        request: NextRequest,
        DtoClass: new (data: unknown) => T,
        paramKey?: string,
        routeParams?: Record<string, string>
    ): Promise<RequestExtractWithDtoResult<T>>;

    static async extract(
        request: NextRequest,
        DtoClass?: undefined,
        paramKey?: string,
        routeParams?: Record<string, string>
    ): Promise<RequestExtractWithoutDtoResult>;

    static async extract<T extends DTO>(
        request: NextRequest,
        DtoClass?: new (data: unknown) => T,
        paramKey?: string,
        routeParams?: Record<string, string>
    ) {
        const tokens = this.getTokensFromCookies(request);
        const client = this.getClientInfo(request);

        const dto = DtoClass
            ? await this.getRequestDto(request, DtoClass)
            : null;

        const param = this.getParamFromRequest(request, paramKey, routeParams);

        return {
            ...tokens,
            ...client,
            dto,
            param,
        };
    }
}

export default RequestManager;