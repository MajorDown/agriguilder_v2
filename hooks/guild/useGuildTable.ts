'use client';

import { useCallback, useEffect, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { PublicGuildWithData } from "@/modules/guild/guild.types";

type ApiSuccessResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
    code?: string;
};

export type UseGuildTableReturn = {
    guilds: PublicGuildWithData[];
    isLoading: boolean;
    errorMessage: string | null;
    refreshGuilds: () => Promise<void>;
};

export default function useGuildTable(): UseGuildTableReturn {

    const [guilds, setGuilds] = useState<PublicGuildWithData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const refreshGuilds = useCallback(async () => {

        setIsLoading(true);
        setErrorMessage(null);

        try {

            const response = await FetchManager.fetch(
                "/api/guild/get-all",
                {
                    method: "GET",
                }
            );

            if (!response.ok) {

                let message = "Impossible de récupérer les guildes.";

                try {
                    const errorBody = await response.json();
                    message = errorBody?.message ?? message;
                } catch {
                    // on garde le message par défaut
                }

                setGuilds([]);
                setErrorMessage(message);
                return;
            }

            const responseBody: ApiSuccessResponse<PublicGuildWithData[]> = await response.json();

            setGuilds(responseBody.data ?? []);

        } catch (error) {

            console.error("Erreur lors du chargement des guildes :", error);

            setGuilds([]);
            setErrorMessage("Une erreur est survenue lors du chargement des guildes.");

        } finally {

            setIsLoading(false);

        }

    }, []);

    useEffect(() => {
        refreshGuilds();
    }, [refreshGuilds]);

    return {
        guilds,
        isLoading,
        errorMessage,
        refreshGuilds,
    };
}