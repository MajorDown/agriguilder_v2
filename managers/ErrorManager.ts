export class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;

        // Important pour que instanceof fonctionne correctement
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export type ErrorOptions = {
    message: string;
    statusCode?: number;
    code?: string;
};

class ErrorManager {
    /**
     * @description Crée une AppError standard
     */
    static create({
        message,
        statusCode = 400,
        code = "APP_ERROR"
    }: ErrorOptions): AppError {
        return new AppError(message, statusCode, code);
    }

    /**
     * @description
     * - Si l'erreur est déjà une AppError → on la retourne telle quelle
     * - Sinon → on crée une nouvelle AppError standardisée
     */
    static throwOrCreate(error: unknown, options: ErrorOptions): AppError {
        if (error instanceof AppError) {
            return error;
        }

        // Log pour debug (sinon tu vas galérer plus tard)
        console.error("Unhandled error:", error);

        return new AppError(
            options.message,
            options.statusCode ?? 500,
            options.code ?? "INTERNAL_ERROR"
        );
    }
}

export default ErrorManager;