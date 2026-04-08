'use client';
import { useCallback, useEffect, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import { PublicMember } from "@/modules/member/member.types";

type ApiSuccessResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
    code?: string;
};

export type UseMemberTableReturn = {
    members: PublicMember[];
    isLoading: boolean;
    errorMessage: string | null;
    refreshMembers: () => Promise<void>;
};

export default function useMemberTable(guildName: string): UseMemberTableReturn {
    const [members, setMembers] = useState<PublicMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const refreshMembers = useCallback(async () => {
        if (!guildName || !guildName.trim()) {
            setMembers([]);
            setErrorMessage("Aucune guilde sélectionnée.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await FetchManager.fetch(
                `/api/member/get-by-guild/${encodeURIComponent(guildName)}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                let message = "Impossible de récupérer les membres.";

                try {
                    const errorBody = await response.json();
                    message = errorBody?.message ?? message;
                } catch {
                    // on garde le message par défaut
                }

                setMembers([]);
                setErrorMessage(message);
                return;
            }

            const responseBody: ApiSuccessResponse<PublicMember[]> = await response.json();
            setMembers(responseBody.data ?? []);
        } catch (error) {
            console.error("Erreur lors du chargement des membres :", error);
            setMembers([]);
            setErrorMessage("Une erreur est survenue lors du chargement des membres.");
        } finally {
            setIsLoading(false);
        }
    }, [guildName]);

    useEffect(() => {
        void refreshMembers();
    }, [refreshMembers]);

    return {
        members,
        isLoading,
        errorMessage,
        refreshMembers,
    };
}