'use client';

import FetchManager from "@/managers/FetchManager";
import { useState } from "react";
import { ContestationStatus } from "@/prisma/generated/prisma/enums";

export type ResolveContestationPayload = {
    contestationId: string;
    guildName: string;
    status: ContestationStatus;
    payerId: string;
    day: string;
    duration: number;
    surface?: number;
    tools: string[];
    description?: string | null;
};

export type UseResolveContestationResult = {
    isLoading: boolean;
    errorMessage: string;
    successMessage: string;
    resolveContestation: (payload: ResolveContestationPayload) => Promise<boolean>;
    resetState: () => void;
};

export default function useResolveContestation(): UseResolveContestationResult {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const resetState = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const resolveContestation = async (
        payload: ResolveContestationPayload
    ): Promise<boolean> => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await FetchManager.fetch("/api/contestation/resolve", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contestationId: payload.contestationId,
                    guildName: payload.guildName,
                    status: payload.status,
                    payerId: payload.payerId,
                    day: payload.day,
                    duration: payload.duration,
                    surface: payload.surface,
                    tools: payload.tools,
                    description: payload.description,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    data?.message || "Une erreur est survenue lors de la résolution de la contestation."
                );
                return false;
            }

            setSuccessMessage(
                data?.message || "La contestation a bien été résolue."
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
        resolveContestation,
        resetState,
    };
}