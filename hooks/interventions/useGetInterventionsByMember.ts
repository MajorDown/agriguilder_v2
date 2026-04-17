'use client';

import { useCallback, useEffect, useState } from "react";
import { PublicIntervention } from "@/modules/intervention/intervention.types";
import FetchManager from "@/managers/FetchManager";

export type UseMemberInterventionsResult = {
    interventions: PublicIntervention[];
    isLoading: boolean;
    errorMessage: string;
    refreshInterventions: () => Promise<void>;
};

type GetByMemberResponse = {
    success: boolean;
    data?: PublicIntervention[];
    message?: string;
};

export default function useGetInterventionByMember(
    guildName?: string
): UseMemberInterventionsResult {
    const [interventions, setInterventions] = useState<PublicIntervention[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const refreshInterventions = useCallback(async () => {
        if (!guildName) {
            setInterventions([]);
            setErrorMessage("");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            const response = await FetchManager.fetch(`/api/intervention/get-by-member/${encodeURIComponent(guildName)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data: GetByMemberResponse = await response.json();
            console.log(data)

            if (!response.ok || !data.success) {
                setInterventions([]);
                setErrorMessage(
                    data.message || "Impossible de récupérer les interventions du membre."
                );
                return;
            }

            setInterventions(data.data ?? []);
        } catch (error) {
            setInterventions([]);
            setErrorMessage("Une erreur est survenue lors du chargement des interventions.");
        } finally {
            setIsLoading(false);
        }
    }, [guildName]);

    useEffect(() => {
        refreshInterventions();
    }, [refreshInterventions]);

    return {
        interventions,
        isLoading,
        errorMessage,
        refreshInterventions,
    };
}