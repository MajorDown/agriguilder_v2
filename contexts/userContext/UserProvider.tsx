"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import UserContext from "./UserContext";
import { GuildRole, UserAppData } from "./userContext.types";
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
    const [selectedRole, setSelectedRole] = useState<GuildRole | null>(null);

    const refreshUser = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await FetchManager.fetch("/api/user/get-context", {
                method: "GET",
            });
            if (!response.ok) {
                setUser(null);
                setSelectedGuild(null);
                setSelectedRole(null);
                return;
            }
            const responseBody: ApiSuccessResponse<UserAppData> = await response.json();
            const userData = responseBody.data ?? null;
            setUser(userData);
        } catch (error) {
            console.error("Erreur lors du chargement du contexte utilisateur :", error);
            setUser(null);
            setSelectedGuild(null);
            setSelectedRole(null);
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
            selectedRole,
            setSelectedRole,
            refreshUser,
        }),
        [user, isLoading, selectedGuild, selectedRole, refreshUser]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}