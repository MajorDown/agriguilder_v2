import { useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { PublicRule } from "@/modules/rule/rule.types";

export type UseUpdateRuleParams = {
    rule: PublicRule;
    guildName: string;
    onUpdate?: () => void;
};

export default function useUpdateRule(params: UseUpdateRuleParams) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(params.rule.content);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const startEditing = () => {
        setContent(params.rule.content);
        setErrorMessage(null);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setContent(params.rule.content);
        setErrorMessage(null);
        setIsEditing(false);
    };

    const submitUpdate = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const trimmedContent = content.trim();

            if (!trimmedContent) {
                setErrorMessage("Le contenu de la règle ne peut pas être vide.");
                return false;
            }

            if (trimmedContent === params.rule.content.trim()) {
                setIsEditing(false);
                return true;
            }

            const response = await FetchManager.fetch("/api/rule/update", {
                method: "PUT",
                body: JSON.stringify({
                    id: params.rule.id,
                    guildName: params.guildName,
                    content: trimmedContent,
                }),
            });

            const updatedRule = await response.json();

            params.onUpdate?.();
            setIsEditing(false);

            return true;
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la modification de la règle."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isEditing,
        content,
        isLoading,
        errorMessage,
        setContent,
        startEditing,
        cancelEditing,
        submitUpdate,
    };
}