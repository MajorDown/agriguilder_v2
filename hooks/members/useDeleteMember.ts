'use client';

import { useCallback, useState } from "react";
import FetchManager from "@/managers/FetchManager";

type UseDeleteMemberParams = {
    guildName: string;
    onSuccess?: () => void | Promise<void>;
};

type DeleteMemberInput = {
    memberId: string;
};

type ApiErrorResponse = {
    success: false;
    code?: string;
    message?: string;
};

export type UseDeleteMemberReturn = {
    isSubmitting: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    deleteMember: (input: DeleteMemberInput) => Promise<boolean>;
    resetMessages: () => void;
};

export default function useDeleteMember(
    params: UseDeleteMemberParams
): UseDeleteMemberReturn {
    const { guildName, onSuccess } = params;
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const resetMessages = useCallback(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
    }, []);

    const deleteMember = useCallback(
        async (input: DeleteMemberInput): Promise<boolean> => {
            resetMessages();
            if (!guildName.trim()) {
                setErrorMessage("Aucune guilde n'est sélectionnée.");
                return false;
            }
            if (!input.memberId.trim()) {
                setErrorMessage("Identifiant du membre manquant.");
                return false;
            }
            setIsSubmitting(true);
            try {
                const response = await FetchManager.fetch("/api/member/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        memberId: input.memberId,
                        guildName,
                    }),
                });
                if (!response.ok) {
                    let message = "Impossible de supprimer ce membre de la guilde.";
                    try {
                        const errorBody: ApiErrorResponse = await response.json();
                        message = errorBody.message ?? message;
                    } catch {
                        // on garde le message par défaut
                    }
                    setErrorMessage(message);
                    return false;
                }
                setSuccessMessage("Le membre a bien été supprimé de la guilde.");
                if (onSuccess) {
                    await onSuccess();
                }
                return true;
            } catch (error) {
                console.error("Erreur lors de la suppression du membre :", error);
                setErrorMessage("Une erreur est survenue lors de la suppression du membre.");
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
        deleteMember,
        resetMessages,
    };
}