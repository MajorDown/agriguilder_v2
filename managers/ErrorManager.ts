export class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

export type ErrorOptions = {
    message: string;
    statusCode?: number;
    code?: string;
};

class ErrorManager {
    static create({
        message,
        statusCode = 400,
        code = "APP_ERROR"
    }: ErrorOptions) {
        return new AppError(message, statusCode, code);
    }
}

export default ErrorManager;