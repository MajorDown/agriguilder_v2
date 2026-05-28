'use client';

import { useCallback, useEffect, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { PublicContestation } from "@/modules/contestation/contestation.types";

export type UseGuildContestationsResult = {
    contestations: PublicContestation[];
    isLoading: boolean;
    errorMessage: string;
    refreshContestations: () => Promise<void>;
};

type GetByGuildResponse = {
    success: boolean;
    data?: PublicContestation[];
    message?: string;
};

export default function useGetGuildContestations(
    guildName?: string
): UseGuildContestationsResult {
    const [contestations, setContestations] = useState<PublicContestation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const refreshContestations = useCallback(async () => {
        if (!guildName) {
            setContestations([]);
            setErrorMessage("");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            const response = await FetchManager.fetch(`/api/contestation/get-by-guild/${encodeURIComponent(guildName)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data: GetByGuildResponse = await response.json();

            if (!response.ok || !data.success) {
                setContestations([]);
                setErrorMessage(
                    data.message || "Impossible de récupérer les contestations de la guilde."
                );
                return;
            }

            setContestations(data.data ?? []);
        } catch (error) {
            setContestations([]);
            setErrorMessage("Une erreur est survenue lors de la récupération des contestations de la guilde.");
        } finally {
            setIsLoading(false);
        }
    }, [guildName]);

    useEffect(() => {
        refreshContestations();
    }, [refreshContestations]);

    return {
        contestations,
        isLoading,
        errorMessage,
        refreshContestations,
    };
}