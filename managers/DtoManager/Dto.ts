import { validateDto } from "./validateDto";

export class DTO {
    constructor(data: any, options?: { validate?: boolean }) {
        if (data && typeof data === "object") {
            Object.assign(this, data);
        }
        if (options?.validate !== false) {
            validateDto(this);
        }
    }
}
