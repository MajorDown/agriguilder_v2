'use client';

import { useCallback, useEffect, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { PublicTool } from "@/modules/tool/tool.types";

type ApiSuccessResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
    code?: string;
};

export type UseToolTableReturn = {
    tools: PublicTool[];
    isLoading: boolean;
    errorMessage: string | null;
    refreshTools: () => Promise<void>;
};

export default function useToolTable(guildName: string): UseToolTableReturn {
    const [tools, setTools] = useState<PublicTool[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const refreshTools = useCallback(async () => {
        if (!guildName || guildName === "non sélectionnée") {
            setTools([]);
            setErrorMessage("Aucune guilde sélectionnée.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await FetchManager.fetch(
                `/api/tool/get-by-guild/${encodeURIComponent(guildName)}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                let message = "Impossible de récupérer les outils.";
                try {
                    const errorBody = await response.json();
                    message = errorBody?.message ?? message;
                } catch {
                    // on garde le message par défaut
                }

                setTools([]);
                setErrorMessage(message);
                return;
            }

            const responseBody: ApiSuccessResponse<PublicTool[]> = await response.json();
            setTools(responseBody.data ?? []);
        } catch (error) {
            console.error("Erreur lors du chargement des outils :", error);
            setTools([]);
            setErrorMessage("Une erreur est survenue lors du chargement des outils.");
        } finally {
            setIsLoading(false);
        }
    }, [guildName]);

    useEffect(() => {
        refreshTools();
    }, [refreshTools]);

    return {
        tools,
        isLoading,
        errorMessage,
        refreshTools,
    };
}