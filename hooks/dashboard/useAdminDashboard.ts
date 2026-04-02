'use client';
import { useCallback, useEffect, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { AdminDashBoardData } from "@/modules/dashboard/dashboard.types";

type ApiSuccessResponse<T> = {
    success: true;
    data: T;
};

type UseAdminDashboardReturn = {
    data: AdminDashBoardData | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

export default function useAdminDashboard(selectedGuild: string | null): UseAdminDashboardReturn {
    const [data, setData] = useState<AdminDashBoardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!selectedGuild) {
            setData(null);
            setError(null);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await FetchManager.fetch(`/api/dashboard/admin?guildId=${selectedGuild}`, {
                method: "GET",
                cache: "no-store",
            });
            if (!response.ok) {
                setData(null);
                setError("Impossible de charger les données du tableau de bord.");
                return;
            }
            const body: ApiSuccessResponse<AdminDashBoardData> = await response.json();
            setData(body.data);
        } catch (err) {
            console.error("Erreur lors du chargement du dashboard admin :", err);
            setData(null);
            setError("Une erreur est survenue lors du chargement du tableau de bord.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedGuild]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        data,
        isLoading,
        error,
        refresh,
    };
}