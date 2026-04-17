'use client';

import FetchManager from "@/managers/FetchManager";
import { useState } from "react";

export type CreateContestationPayload = {
    interventionId: string;
    guildName: string;
    reason: string;
};

export type UseCreateContestationResult = {
    isLoading: boolean;
    errorMessage: string;
    successMessage: string;
    createContestation: (payload: CreateContestationPayload, userId: string) => Promise<boolean>;
    resetState: () => void;
};

export default function useCreateContestation(): UseCreateContestationResult {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const resetState = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const createContestation = async (
        payload: CreateContestationPayload,
        userId: string
    ): Promise<boolean> => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await FetchManager.fetch("/api/contestation.create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    interventionId: payload.interventionId,
                    guildName: payload.guildName,
                    userId,
                    reason: payload.reason,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    data?.message || "Une erreur est survenue lors de la création de la contestation."
                );
                return false;
            }

            setSuccessMessage(
                data?.message || "La contestation a bien été enregistrée."
            );

            return true;
        } catch (error) {
            setErrorMessage("Impossible de contacter le serveur.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        errorMessage,
        successMessage,
        createContestation,
        resetState,
    };
}