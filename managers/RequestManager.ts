import { NextRequest } from "next/server";
import CookiesManager from "./CookiesManager";
import ErrorManager from "./ErrorManager";
import { DTO } from "./DtoManager";

export type RequestExtractResult<T> = {
    access_token: string | null;
    refresh_token: string | null;
    device_id: string | null;
    dto: T | null;
    param: string | null;
};

/**
 * @description Extraction simple des données utiles d'une requête.
 */
class RequestManager {
    private static getTokensFromCookies(request: NextRequest) {
        return {
            access_token: CookiesManager.getAccessToken(request),
            refresh_token: CookiesManager.getRefreshToken(request),
            device_id: CookiesManager.getDeviceId(request),
        };
    }

    private static async getRequestDto<T extends DTO>(
        request: NextRequest,
        DtoClass: new (data: unknown) => T
    ): Promise<T | null> {
        if (request.method === "GET" || request.method === "HEAD") {
            return null;
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            throw ErrorManager.create({
                message: "le body de la requête n'est pas un JSON valide",
                statusCode: 400,
                code: "INVALID_JSON",
            });
        }

        return new DtoClass(body);
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

        // Fallback simple: dernier segment de l'URL (/users/123 -> 123)
        const segments = request.nextUrl.pathname.split("/").filter(Boolean);
        return segments.length > 0 ? decodeURIComponent(segments[segments.length - 1]) : null;
    }

    /**
     * @example
     * const { dto, access_token, param } = await RequestManager.extract(req, MyDto, "id", params)
     */
    static async extract<T extends DTO>(
        request: NextRequest,
        DtoClass?: new (data: unknown) => T,
        paramKey?: string,
        routeParams?: Record<string, string>
    ): Promise<RequestExtractResult<T>> {
        const tokens = this.getTokensFromCookies(request);
        const dto = DtoClass ? await this.getRequestDto(request, DtoClass) : null;
        const param = this.getParamFromRequest(request, paramKey, routeParams);

        return {
            ...tokens,
            dto,
            param,
        };
    }
}

export default RequestManager;
