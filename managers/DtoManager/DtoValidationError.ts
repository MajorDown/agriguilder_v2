export class DtoValidationError extends Error {
    details: Record<string, string[]>;

    constructor(details: Record<string, string[]>) {
        super("Invalid DTO");
        this.details = details;
    }
}