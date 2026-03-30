import { EmailAuthCodeContext } from "@/prisma/generated/prisma/enums";

export type CreateEmailAuthCodeInput = {
    email: string;
    context: EmailAuthCodeContext;
}

export type CheckEmailAuthCodeInput = {
    email: string;
    code: string;
    context: EmailAuthCodeContext;
}