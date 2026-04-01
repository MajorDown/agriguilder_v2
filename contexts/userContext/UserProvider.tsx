"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import UserContext from "./UserContext";
import { UserAppData } from "./userContext.types";
import FetchManager from "@/managers/FetchManager";

type UserProviderProps = {
    children: React.ReactNode;
};

type ApiSuccessResponse<T> = {
    success: boolean;
    data: T;
};

export default function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<UserAppData>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedGuild, setSelectedGuild] = useState<string | null>(null);

    const refreshUser = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await FetchManager.fetch("/api/user/get-context", {
                method: "GET",
            });

            if (!response.ok) {
                setUser(null);
                setSelectedGuild(null);
                return;
            }

            const responseBody: ApiSuccessResponse<UserAppData> = await response.json();
            const userData = responseBody.data ?? null;

            setUser(userData);

            setSelectedGuild((currentSelectedGuild) => {
                if (!userData?.relations?.length) {
                    return null;
                }

                const selectedGuildStillExists = currentSelectedGuild
                    ? userData.relations.some(
                          (relation) => relation.guildId === currentSelectedGuild
                      )
                    : false;

                if (selectedGuildStillExists) {
                    return currentSelectedGuild;
                }

                return userData.relations[0].guildId;
            });
        } catch (error) {
            console.error("Erreur lors du chargement du contexte utilisateur :", error);
            setUser(null);
            setSelectedGuild(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const value = useMemo(
        () => ({
            user,
            setUser,
            isLoading,
            setIsLoading,
            selectedGuild,
            setSelectedGuild,
            refreshUser,
        }),
        [user, isLoading, selectedGuild, refreshUser]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}