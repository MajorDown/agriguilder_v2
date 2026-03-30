import { NextRequest, NextResponse } from "next/server";

class CookiesManager {
    private static readonly ACCESS_TOKEN = "accessToken";
    private static readonly SESSION_TOKEN = "sessionToken";
    private static readonly DEVICE_ID = "deviceId";

    /**
     * @description Options de cookies en environnement de développement
     */
    private static devOptions = {
        httpOnly: true,
        secure: false, // HTTP autorisé en local
        sameSite: "lax" as const,
        path: "/",
    };

    /**
     * @description Options de cookies en environnement de production
     */
    private static prodOptions = {
        httpOnly: true,
        secure: true, // HTTPS obligatoire
        sameSite: "none" as const,
        path: "/",
    };

    /**
     * @description Retourne automatiquement les options de cookie
     * selon l'environnement courant
     */
    private static get options() {
        return process.env.NODE_ENV === "production"
            ? this.prodOptions
            : this.devOptions;
    }

    /**
     * @description Définit le cookie accessToken
     * @param response - NextResponse
     * @param token - JWT d'accès
     */
    static setAccessToken(response: NextResponse, token: string): void {
        response.cookies.set(this.ACCESS_TOKEN, token, this.options);
    }

    /**
     * @description Supprime le cookie accessToken
     * @param response - NextResponse
     */
    static deleteAccessToken(response: NextResponse): void {
        response.cookies.delete(this.ACCESS_TOKEN);
    }

    /**
     * @description Récupère le accessToken depuis la requête
     * @param req - NextRequest
     * @returns string | null
     */
    static getAccessToken(req: NextRequest): string | null {
        const cookie = req.cookies.get(this.ACCESS_TOKEN);
        return cookie?.value ?? null;
    }

    /**
     * @description Définit le cookie refreshToken
     * @param response - NextResponse
     * @param token - JWT de rafraîchissement
     */
    static setSessionToken(response: NextResponse, token: string): void {
        response.cookies.set(this.SESSION_TOKEN, token, this.options);
    }

    /**
     * @description Supprime le cookie sessionToken
     * @param response - NextResponse
     */
    static deleteSessionToken(response: NextResponse): void {
        response.cookies.delete(this.SESSION_TOKEN);
    }

    /**
     * @description Récupère le sessionToken depuis la requête
     * @param req - NextRequest
     * @returns string | null
     */
    static getSessionToken(req: NextRequest): string | null {
        const cookie = req.cookies.get(this.SESSION_TOKEN);
        return cookie?.value ?? null;
    }

    /**
     * @description Définit le cookie deviceId
     * @param response - NextResponse
     * @param deviceId - Identifiant unique du device
     */
    static setDeviceId(response: NextResponse, deviceId: string): void {
        response.cookies.set(this.DEVICE_ID, deviceId, this.options);
    }

    /**
     * @description Supprime le cookie deviceId
     * @param response - NextResponse
     */
    static deleteDeviceId(response: NextResponse): void {
        response.cookies.delete(this.DEVICE_ID);
    }

    /**
     * @description Récupère le deviceId depuis la requête
     * @param req - NextRequest
     * @returns string | null
     */
    static getDeviceId(req: NextRequest): string | null {
        const cookie = req.cookies.get(this.DEVICE_ID);
        return cookie?.value ?? null;
    }

    /**
     * @description Supprime tous les cookies liés à l'authentification
     * (accessToken + sessionToken)
     * @param response - NextResponse
     */
    static clearAuthCookies(response: NextResponse): void {
        this.deleteAccessToken(response);
        this.deleteSessionToken(response);
    }
}

export default CookiesManager;
