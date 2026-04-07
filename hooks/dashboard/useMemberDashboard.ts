'use client';

import { useCallback, useEffect, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { MemberDashboardData } from "@/modules/dashboard/dashboard.types";

type UseMemberDashboardReturn = {
    data: MemberDashboardData | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

export default function useMemberDashboard(memberId: string): UseMemberDashboardReturn {
    const [data, setData] = useState<MemberDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!member) {
            setData(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await FetchManager.fetch(
                `/api/dashboard/member/`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );
            if (!response.ok) {
                setData(null);
                setError("Impossible de charger les données du tableau de bord.");
                return;
            }
            const body = await response.json();
            setData(body.data.data);
        } catch (err) {
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