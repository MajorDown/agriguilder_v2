'use client';

import { FormEvent, useCallback, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import useUserContext from "@/contexts/userContext/useUserContext";

export type ToolUnit = "HEURE" | "ARE";

type UseCreateToolParams = {
    guildName: string;
    onSuccess?: () => void | Promise<void>;
};

type ApiErrorResponse = {
    success: false;
    code?: string;
    message?: string;
};

export type UseCreateToolReturn = {
    toolName: string;
    toolCoef: string;
    toolUnit: ToolUnit;
    isSubmitting: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    handleToolNameChange: (value: string) => void;
    handleToolCoefChange: (value: string) => void;
    handleToolUnitChange: (value: ToolUnit) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    resetForm: () => void;
};

export default function useCreateTool(params: UseCreateToolParams): UseCreateToolReturn {
    const { user } = useUserContext();
    const { guildName, onSuccess } = params;

    const [toolName, setToolName] = useState<string>("");
    const [toolCoef, setToolCoef] = useState<string>("");
    const [toolUnit, setToolUnit] = useState<ToolUnit>("HEURE");

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleToolNameChange = (value: string) => {
        setToolName(value);
    };

    const handleToolCoefChange = (value: string) => {
        setToolCoef(value);
    };

    const handleToolUnitChange = (value: ToolUnit) => {
        setToolUnit(value);
    };

    const resetForm = useCallback(() => {
        setToolName("");
        setToolCoef("");
        setToolUnit("HEURE");
        setErrorMessage(null);
        setSuccessMessage(null);
    }, []);

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage(null);
        setSuccessMessage(null);

        const trimmedGuildName = guildName.trim();
        const trimmedToolName = toolName.trim();
        const trimmedToolCoef = toolCoef.trim();
        const parsedCoef = Number(trimmedToolCoef);

        const adminId = user?.relations.find(
            (relation) =>
                relation.guildName === guildName &&
                relation.role === "admin"
        )?.role;

        if (!trimmedGuildName) {
            setErrorMessage("Aucune guilde n'est sélectionnée.");
            return;
        }

        if (!adminId) {
            setErrorMessage("Aucun administrateur valide n'est associé à cette guilde.");
            return;
        }

        if (!trimmedToolName) {
            setErrorMessage("Le nom de l'outil est obligatoire.");
            return;
        }

        if (!trimmedToolCoef) {
            setErrorMessage("Le coefficient de l'outil est obligatoire.");
            return;
        }

        if (Number.isNaN(parsedCoef)) {
            setErrorMessage("Le coefficient doit être un nombre valide.");
            return;
        }

        if (parsedCoef <= 0) {
            setErrorMessage("Le coefficient doit être supérieur à 0.");
            return;
        }

        if (!isValidToolUnit(toolUnit)) {
            setErrorMessage("L'unité de calcul de l'outil est invalide.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await FetchManager.fetch("/api/tool/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    guildName: trimmedGuildName,
                    adminId,
                    name: trimmedToolName,
                    unit: toolUnit,
                    coef: parsedCoef,
                }),
            });

            if (!response.ok) {
                let message = "Impossible de créer l'outil.";

                try {
                    const errorBody: ApiErrorResponse = await response.json();
                    message = errorBody.message ?? message;
                } catch {
                    // on garde le message par défaut
                }

                setErrorMessage(message);
                return;
            }

            setSuccessMessage("L'outil a bien été créé.");
            resetForm();

            if (onSuccess) {
                await onSuccess();
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'outil :", error);
            setErrorMessage("Une erreur est survenue lors de la création de l'outil.");
        } finally {
            setIsSubmitting(false);
        }
    }, [guildName, onSuccess, resetForm, toolCoef, toolName, toolUnit, user]);

    return {
        toolName,
        toolCoef,
        toolUnit,
        isSubmitting,
        errorMessage,
        successMessage,
        handleToolNameChange,
        handleToolCoefChange,
        handleToolUnitChange,
        handleSubmit,
        resetForm,
    };
}

function isValidToolUnit(value: string): value is ToolUnit {
    return value === "HEURE" || value === "ARE";
}