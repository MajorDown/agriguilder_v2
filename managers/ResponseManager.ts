import { NextResponse } from "next/server";
import { AppError } from "./ErrorManager";
import LogManager from "./LogManager";
import CookiesManager from "./CookiesManager";

class ResponseManager {
    /**
     * @description Réponse de succès standard
     * @param data - Les données à retourner dans la réponse
     * @param statusCode - Le code de statut HTTP (par défaut 200)
     * @return {NextResponse} La réponse Next.js formatée
     */
    static success<T>(data: T, statusCode = 200): NextResponse {
        return NextResponse.json(
            {
                success: true,
                data,
            },
            { status: statusCode }
        );
    }

    /**
     * @description Réponse de succès standard avec cookies d'authentification
     * @param data - Les données à retourner dans la réponse
     * @param tokens - Les tokens à injecter dans les cookies
     * @param statusCode - Le code de statut HTTP (par défaut 200)
     * @return {NextResponse} La réponse Next.js formatée
     */
    static successAndNewCookies<T>(
        data: T,
        tokens: {
            accessToken?: string;
            sessionToken?: string;
        },
        statusCode = 200
    ): NextResponse {
        const response = NextResponse.json(
            {
                success: true,
                data,
            },
            { status: statusCode }
        );

        CookiesManager.setAuthCookies(response, tokens);

        return response;
    }

    /**
     * @description Réponse de création standard
     * @param data - Les données à retourner dans la réponse
     * @return {NextResponse} La réponse Next.js formatée
     */
    static created<T>(data: T): NextResponse {
        return NextResponse.json(
            {
                success: true,
                data,
            },
            { status: 201 }
        );
    }

    /**
     * @description Réponse de création avec cookies d'authentification
     * @param data - Les données à retourner dans la réponse
     * @param tokens - Les tokens à injecter dans les cookies
     * @return {NextResponse} La réponse Next.js formatée
     */
    static createdAndNewAuthCookies<T>(
        data: T,
        tokens: {
            accessToken?: string;
            sessionToken?: string;
        }
    ): NextResponse {
        const response = NextResponse.json(
            {
                success: true,
                data,
            },
            { status: 201 }
        );

        CookiesManager.setAuthCookies(response, tokens);

        return response;
    }

    /**
     * @description Réponse simple avec message
     * @param message - Le message à retourner
     * @param statusCode - Le code de statut HTTP (par défaut 200)
     * @return {NextResponse} La réponse Next.js formatée
     */
    static message(message: string, statusCode = 200): NextResponse {
        return NextResponse.json(
            {
                success: true,
                message,
            },
            { status: statusCode }
        );
    }

    /**
     * @description Réponse simple avec message et cookies d'authentification
     * @param message - Le message à retourner
     * @param tokens - Les tokens à injecter dans les cookies
     * @param statusCode - Le code de statut HTTP (par défaut 200)
     * @return {NextResponse} La réponse Next.js formatée
     */
    static messageAndNewAuthCookies(
        message: string,
        tokens: {
            accessToken?: string;
            sessionToken?: string;
        },
        statusCode = 200
    ): NextResponse {
        const response = NextResponse.json(
            {
                success: true,
                message,
            },
            { status: statusCode }
        );

        CookiesManager.setAuthCookies(response, tokens);

        return response;
    }

    /**
     * @description Réponse de succès avec suppression des cookies d'authentification
     * @param data - Les données à retourner dans la réponse
     * @param statusCode - Le code de statut HTTP (par défaut 200)
     * @return {NextResponse} La réponse Next.js formatée
     */
    static successAndClearAuthCookies<T>(
        data: T,
        statusCode = 200
    ): NextResponse {
        const response = NextResponse.json(
            {
                success: true,
                data,
            },
            { status: statusCode }
        );

        CookiesManager.clearAuthCookies(response);

        return response;
    }

    /**
     * @description Réponse d'erreur standardisée
     * @param error - L'erreur à traiter
     * @return {NextResponse} La réponse Next.js formatée
     */
    static error(error: unknown): NextResponse {
        if (error instanceof AppError) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                },
                { status: error.statusCode }
            );
        }

        LogManager.error(
            `Une erreur inattendue est survenue : ${
                error instanceof Error ? error.stack : String(error)
            }`
        );

        return NextResponse.json(
            {
                success: false,
                error: {
                    message: "Erreur interne du serveur",
                    code: "INTERNAL_SERVER_ERROR",
                },
            },
            { status: 500 }
        );
    }
}

export default ResponseManager;