import { useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { PublicRule } from "@/modules/rule/rule.types";

export type UseDeleteRuleParams = {
    rule: PublicRule;
    guildName: string;
    onDelete?: () => void;
};

export default function useDeleteRule(params: UseDeleteRuleParams) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const submitDelete = async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            await FetchManager.fetch(`/api/rule/delete`, {
                method: "DELETE",
                body: JSON.stringify({ 
                    id: params.rule.id,
                    guildName: params.guildName,}),
            });

            params.onDelete?.();

            return true;
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la suppression de la règle."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        errorMessage,
        submitDelete,
    };
}