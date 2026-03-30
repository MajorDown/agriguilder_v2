import { NextResponse } from "next/server";
import { AppError } from "./ErrorManager";
import LogManager from "./LogManager";

class ResponseManager {
    /**
     * @description Réponse de succès standard
     * @param {any} data Les données à retourner dans la réponse
     * @param {number} statusCode Le code de statut HTTP (par défaut 200)
     * @return {NextResponse} La réponse Next.js formatée
     */
    static success<T>(data: T, statusCode = 200) {
        return NextResponse.json(
            {
                success: true,
                data,
            },
            { status: statusCode }
        );
    }

    /**
     * @description Réponse de création standard
     * @param {any} data Les données à retourner dans la réponse
     * @return {NextResponse} La réponse Next.js formatée
     */
    static created<T>(data: T) {
        return NextResponse.json(
            {
                success: true,
                data,
            },
            { status: 201 }
        );
    }

    /**
     * @description Réponse simple avec message
     * @param {string} message Le message à retourner
     * @param {number} statusCode Le code de statut HTTP (par défaut 200)
     * @return {NextResponse} La réponse Next.js formatée
     */
    static message(message: string, statusCode = 200) {
        return NextResponse.json(
            {
                success: true,
                message,
            },
            { status: statusCode }
        );
    }

    /**
     * @description Réponse d'erreur standardisée
     * @param {unknown} error L'erreur à traiter
     * @return {NextResponse} La réponse Next.js formatée
     */
    static error(error: unknown) {
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
        LogManager.error(`Une erreur inattendue est survenue : ${error instanceof Error ? error.stack : String(error)}`);
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