import { useState } from "react";
import FetchManager from "@/managers/FetchManager";
import type {
    CheckMemberByEmailInput,
    CheckMemberByEmailResult,
} from "@/modules/member/member.types";

type CheckEmailHookResult =
    | {
        ok: true;
        data: CheckMemberByEmailResult;
    }
    | {
        ok: false;
        error: string;
        code?: string;
    };

type UseCheckMemberByEmailReturn = {
    isLoading: boolean;
    error: string | null;
    data: CheckMemberByEmailResult | null;
    checkEmail: (input: CheckMemberByEmailInput) => Promise<CheckEmailHookResult>;
    reset: () => void;
};

export default function useCheckMemberByEmail(): UseCheckMemberByEmailReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CheckMemberByEmailResult | null>(null);

    async function checkEmail(input: CheckMemberByEmailInput): Promise<CheckEmailHookResult> {
        try {
            setIsLoading(true);
            setError(null);
            setData(null);

            const response = await FetchManager.fetch("/api/member/check-by-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const json = await response.json();

            if (!response.ok) {
                const backendMessage =
                    json?.error?.message ||
                    json?.message ||
                    "Erreur lors de la vérification de l'email";

                const backendCode =
                    json?.error?.code ||
                    json?.code;

                setError(backendMessage);

                return {
                    ok: false,
                    error: backendMessage,
                    code: backendCode,
                };
            }

            setData(json.data);

            return {
                ok: true,
                data: json.data,
            };
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur inconnue lors de la vérification de l'email";

            setError(message);

            return {
                ok: false,
                error: message,
            };
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        setError(null);
        setData(null);
        setIsLoading(false);
    }

    return {
        isLoading,
        error,
        data,
        checkEmail,
        reset,
    };
}