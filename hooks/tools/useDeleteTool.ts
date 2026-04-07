'use client';

import { useCallback, useState } from "react";
import FetchManager from "@/managers/FetchManager";

type UseDeleteToolParams = {
    guildName: string;
    onSuccess?: () => void | Promise<void>;
};

type DeleteToolInput = {
    id: string;
};

type ApiErrorResponse = {
    success: false;
    code?: string;
    message?: string;
};

export type UseDeleteToolReturn = {
    isSubmitting: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    deleteTool: (input: DeleteToolInput) => Promise<boolean>;
    resetMessages: () => void;
};

export default function useDeleteTool(
    params: UseDeleteToolParams
): UseDeleteToolReturn {
    const { guildName, onSuccess } = params;

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const resetMessages = useCallback(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
    }, []);

    const deleteTool = useCallback(
        async (input: DeleteToolInput): Promise<boolean> => {
            resetMessages();
            if (!guildName.trim()) {
                setErrorMessage("Aucune guilde n'est sélectionnée.");
                return false;
            }
            if (!input.id.trim()) {
                setErrorMessage("Identifiant de l'outil manquant.");
                return false;
            }
            setIsSubmitting(true);
            try {
                const response = await FetchManager.fetch("/api/tool/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: input.id,
                        guildName,
                    }),
                });
                if (!response.ok) {
                    let message = "Impossible de supprimer l'outil.";
                    try {
                        const errorBody: ApiErrorResponse = await response.json();
                        message = errorBody.message ?? message;
                    } catch {
                        // on garde le message par défaut
                    }
                    setErrorMessage(message);
                    return false;
                }

                setSuccessMessage("L'outil a bien été supprimé.");
                if (onSuccess) {
                    await onSuccess();
                }
                return true;
            } catch (error) {
                console.error("Erreur lors de la suppression de l'outil :", error);
                setErrorMessage("Une erreur est survenue lors de la suppression de l'outil.");
                return false;
            } finally {
                setIsSubmitting(false);
            }
        },
        [guildName, onSuccess, resetMessages]
    );

    return {
        isSubmitting,
        errorMessage,
        successMessage,
        deleteTool,
        resetMessages,
    };
}