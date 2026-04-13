import { useState } from "react";
import FetchManager from "@/managers/FetchManager";

export type UseCreateRuleParams = {
    guildName: string;
    onCreate?: () => void;
};

export default function useCreateRule(params: UseCreateRuleParams) {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const reset = () => {
        setContent("");
        setErrorMessage(null);
        setIsLoading(false);
    };

    const submitCreate = async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const trimmedContent = content.trim();

            if (!trimmedContent) {
                setErrorMessage("Le contenu de la règle ne peut pas être vide.");
                return false;
            }

            await FetchManager.fetch("/api/rule/create", {
                method: "POST",
                body: JSON.stringify({
                    guildName: params.guildName,
                    content: trimmedContent,
                }),
            });

            params.onCreate?.();
            reset();

            return true;
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la création de la règle."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        content,
        isLoading,
        errorMessage,
        setContent,
        submitCreate,
        reset,
    };
}