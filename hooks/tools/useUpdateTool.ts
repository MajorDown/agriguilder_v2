'use client';

import { useCallback, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { PublicTool } from "@/modules/tool/tool.types";

type UseUpdateToolParams = {
    tool: PublicTool;
    guildName: string;
    onSuccess?: () => void | Promise<void>;
};

type ApiErrorResponse = {
    success: false;
    code?: string;
    message?: string;
};

export type UseUpdateToolReturn = {
    isEditing: boolean;
    name: string;
    coef: string;
    isSubmitting: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    startEditing: () => void;
    cancelEditing: () => void;
    handleNameChange: (value: string) => void;
    handleCoefChange: (value: string) => void;
    submitUpdate: () => Promise<boolean>;
};

export default function useUpdateTool(
    params: UseUpdateToolParams
): UseUpdateToolReturn {
    const { tool, guildName, onSuccess } = params;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>(tool.name);
    const [coef, setCoef] = useState<string>(tool.coef.toString());
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const startEditing = useCallback(() => {
        setName(tool.name);
        setCoef(tool.coef.toString());
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsEditing(true);
    }, [tool.coef, tool.name]);

    const cancelEditing = useCallback(() => {
        setName(tool.name);
        setCoef(tool.coef.toString());
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsEditing(false);
    }, [tool.coef, tool.name]);

    const handleNameChange = useCallback((value: string) => {
        setName(value);
    }, []);

    const handleCoefChange = useCallback((value: string) => {
        setCoef(value);
    }, []);

    const submitUpdate = useCallback(async (): Promise<boolean> => {
        setErrorMessage(null);
        setSuccessMessage(null);

        const trimmedName = name.trim();
        const parsedCoef = Number(coef);

        if (!guildName.trim()) {
            setErrorMessage("Aucune guilde n'est sélectionnée.");
            return false;
        }

        if (!trimmedName) {
            setErrorMessage("Le nom de l'outil est obligatoire.");
            return false;
        }

        if (!coef.trim()) {
            setErrorMessage("Le coefficient est obligatoire.");
            return false;
        }

        if (Number.isNaN(parsedCoef)) {
            setErrorMessage("Le coefficient doit être un nombre valide.");
            return false;
        }

        if (parsedCoef <= 0) {
            setErrorMessage("Le coefficient doit être supérieur à 0.");
            return false;
        }

        setIsSubmitting(true);

        try {
            const response = await FetchManager.fetch("/api/tool/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: tool.id,
                    guildName,
                    name: trimmedName,
                    coef: parsedCoef,
                }),
            });

            if (!response.ok) {
                let message = "Impossible de mettre à jour l'outil.";

                try {
                    const errorBody: ApiErrorResponse = await response.json();
                    message = errorBody.message ?? message;
                } catch {
                    // on garde le message par défaut
                }

                setErrorMessage(message);
                return false;
            }

            setSuccessMessage("L'outil a bien été mis à jour.");
            setIsEditing(false);

            if (onSuccess) {
                await onSuccess();
            }

            return true;
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'outil :", error);
            setErrorMessage("Une erreur est survenue lors de la mise à jour de l'outil.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [coef, guildName, name, onSuccess, tool.id]);

    return {
        isEditing,
        name,
        coef,
        isSubmitting,
        errorMessage,
        successMessage,
        startEditing,
        cancelEditing,
        handleNameChange,
        handleCoefChange,
        submitUpdate,
    };
}