import { getValidationRules, ValidationRule } from "./decorators";
import { DtoValidationError } from "./DtoValidationError";

export function validateDto<T extends object>(dto: T): T {
    const rulesByProp = getValidationRules((dto as any).constructor);
    const errors: Record<string, string[]> = {};

    const addError = (prop: string, msg: string) => {
        if (!errors[prop]) errors[prop] = [];
        errors[prop].push(msg);
    };

    for (const [prop, rules] of Object.entries(rulesByProp)) {
        const value = (dto as any)[prop];
        const ruleList = rules as ValidationRule[];
        const isRequired = ruleList.includes("required");

        const isEmptyString = typeof value === "string" && value.trim().length === 0;

        if (value === undefined || value === null || (isRequired && isEmptyString)) {
            if (isRequired) {
                addError(prop, "Field is required");
            }
            continue;
        }

        for (const rule of ruleList) {
            if (rule === "required") continue;

            if (rule === "string") {
                if (typeof value !== "string") {
                    addError(prop, "Field must be a string");
                }
                continue;
            }

            if (rule === "number") {
                if (typeof value !== "number") {
                    addError(prop, "Field must be a number");
                }
                continue;
            }

            if (rule === "email") {
                const regex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
                if (typeof value !== "string" || !regex.test(value)) {
                    addError(prop, "Field must be a valid email");
                }
                continue;
            }

            if (typeof rule === "object") {
                if (rule.type === "minLength") {
                    if (typeof value !== "string" || value.length < rule.length) {
                        addError(prop, `Field must be at least ${rule.length} chars`);
                    }
                    continue;
                }

                if (rule.type === "maxLength") {
                    if (typeof value !== "string" || value.length > rule.length) {
                        addError(prop, `Field must be at most ${rule.length} chars`);
                    }
                    continue;
                }

                if (rule.type === "range") {
                    if (typeof value !== "number" || value < rule.min || value > rule.max) {
                        addError(prop, `Field must be between ${rule.min} and ${rule.max}`);
                    }
                    continue;
                }

                if (rule.type === "enum") {
                    if (!rule.allowed.includes(value)) {
                        addError(prop, `Field must be one of: ${rule.allowed.join(", ")}`);
                    }
                    continue;
                }
            }
        }
    }

    if (Object.keys(errors).length > 0) {
        throw new DtoValidationError(errors);
    }

    return dto;
}