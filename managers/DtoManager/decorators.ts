import "reflect-metadata";

const VALIDATION_KEY = Symbol("validation");

export type ValidationRule =
    | "required"
    | "email"
    | "number"
    | "string"
    | { type: "minLength"; length: number }
    | { type: "maxLength"; length: number }
    | { type: "range"; min: number; max: number }
    | { type: "enum"; allowed: readonly string[] };

function pushRule(target: any, propertyKey: string | symbol, rule: ValidationRule) {
    const meta = Reflect.getMetadata(VALIDATION_KEY, target.constructor) || {};
    const key = propertyKey.toString();
    meta[key] = meta[key] ? [...meta[key], rule] : [rule];
    Reflect.defineMetadata(VALIDATION_KEY, meta, target.constructor);
}

export function isRequired(): PropertyDecorator {
    return (target, key) => pushRule(target, key, "required");
}

export function isEmail(): PropertyDecorator {
    return (target, key) => pushRule(target, key, "email");
}

export function isString(): PropertyDecorator {
    return (target, key) => pushRule(target, key, "string");
}

export function isNumber(): PropertyDecorator {
    return (target, key) => pushRule(target, key, "number");
}

export function minLength(length: number): PropertyDecorator {
    return (target, key) => pushRule(target, key, { type: "minLength", length });
}

export function maxLength(length: number): PropertyDecorator {
    return (target, key) => pushRule(target, key, { type: "maxLength", length });
}

export function range(min: number, max: number): PropertyDecorator {
    return (target, key) => pushRule(target, key, { type: "range", min, max });
}

export function isEnum(enumObject: object): PropertyDecorator {
    const allowed = Object.values(enumObject);
    return function (target, propertyKey) {
        pushRule(target, propertyKey, {
            type: "enum",
            allowed
        });
    };
}

export function getValidationRules(target: any) {
    return Reflect.getMetadata(VALIDATION_KEY, target) || {};
}
