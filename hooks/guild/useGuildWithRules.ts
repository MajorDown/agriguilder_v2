'use client';

import { useCallback, useEffect, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { PublicGuildWithRules } from "@/modules/guild/guild.types";

type ApiSuccessResponse = {
    success: true;
    data: PublicGuildWithRules;
};

type ApiErrorResponse = {
    success: false;
    code?: string;
    message?: string;
};

export type UseGuildWithRulesReturn = {
    guild: PublicGuildWithRules | null;
    isLoading: boolean;
    errorMessage: string | null;
    refreshGuild: () => Promise<void>;
};

export default function useGuildWithRules(guildName: string | null | undefined): UseGuildWithRulesReturn {
    const [guild, setGuild] = useState<PublicGuildWithRules | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const refreshGuild = useCallback(async (): Promise<void> => {
        if (!guildName?.trim()) {
            setGuild(null);
            setErrorMessage("Aucune guilde n'est sélectionnée.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await FetchManager.fetch(`/api/guild/get-informations/${guildName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                let message = "Impossible de récupérer les informations de la guilde.";

                try {
                    const errorBody: ApiErrorResponse = await response.json();
                    message = errorBody.message ?? message;
                } catch {
                    // on garde le message par défaut
                }

                setGuild(null);
                setErrorMessage(message);
                return;
            }

            const body: ApiSuccessResponse = await response.json();
            console.log("Réponse de l'API :", body);
            setGuild(body.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de la guilde :", error);
            setGuild(null);
            setErrorMessage("Une erreur est survenue lors du chargement de la guilde.");
        } finally {
            setIsLoading(false);
        }
    }, [guildName]);

    useEffect(() => {
        void refreshGuild();
    }, [refreshGuild]);

    return {
        guild,
        isLoading,
        errorMessage,
        refreshGuild,
    };
}