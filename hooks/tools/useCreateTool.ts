'use client';
import { FormEvent, useCallback, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import useUserContext from "@/contexts/userContext/useUserContext";

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
    isSubmitting: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    handleToolNameChange: (value: string) => void;
    handleToolCoefChange: (value: string) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    resetForm: () => void;
};

export default function useCreateTool(params: UseCreateToolParams): UseCreateToolReturn {
    const { user } = useUserContext();
    const { guildName, onSuccess } = params;

    const [toolName, setToolName] = useState<string>("");
    const [toolCoef, setToolCoef] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleToolNameChange = (value: string) => {
        setToolName(value);
    };

    const handleToolCoefChange = (value: string) => {
        setToolCoef(value);
    };

    const resetForm = useCallback(() => {
        setToolName("");
        setToolCoef("");
        setErrorMessage(null);
        setSuccessMessage(null);
    }, []);

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("submit !");
        setErrorMessage(null);
        setSuccessMessage(null);

        const trimmedToolName = toolName.trim();
        const parsedCoef = Number(toolCoef);

        if (!guildName.trim()) {
            setErrorMessage("Aucune guilde n'est sélectionnée.");
            return;
        }

        if (!trimmedToolName) {
            setErrorMessage("Le nom de l'outil est obligatoire.");
            return;
        }

        if (!toolCoef.trim()) {
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

        setIsSubmitting(true);

        try {
            const response = await FetchManager.fetch("/api/tool/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    guildName,
                    adminId: user?.relations.find(rel => rel.guildName === guildName && rel.role === "admin")?.roleId,
                    name: trimmedToolName,
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
            setToolName("");
            setToolCoef("");

            if (onSuccess) {
                await onSuccess();
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'outil :", error);
            setErrorMessage("Une erreur est survenue lors de la création de l'outil.");
        } finally {
            setIsSubmitting(false);
        }
    }, [guildName, onSuccess, toolCoef, toolName]);

    return {
        toolName,
        toolCoef,
        isSubmitting,
        errorMessage,
        successMessage,
        handleToolNameChange,
        handleToolCoefChange,
        handleSubmit,
        resetForm,
    };
}