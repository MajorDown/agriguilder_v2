'use client';
import { useCallback, useEffect, useState } from "react";
import FetchManager from "@/managers/FetchManager";

type UseToolSwitchParams = {
    toolId: string;
    guildName: string;
    initialIsActive: boolean;
};

export type UseToolSwitchReturn = {
    isActive: boolean;
    isSubmitting: boolean;
    toggleTool: () => Promise<void>;
};

export default function useToolSwitch(
    params: UseToolSwitchParams
): UseToolSwitchReturn {
    const { toolId, guildName, initialIsActive } = params;
    const [isActive, setIsActive] = useState<boolean>(initialIsActive);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        setIsActive(initialIsActive);
    }, [initialIsActive]);

    const toggleTool = useCallback(async () => {
        if (isSubmitting) {
            return;
        }
        const nextIsActive = !isActive;
        setIsSubmitting(true);
        try {
            const response = await FetchManager.fetch("/api/tool/update/status", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: toolId,
                    guildName,
                    isActive: nextIsActive,
                }),
            });
            if (!response.ok) {
                return;
            }
            setIsActive(nextIsActive);
        } catch (error) {
            console.error("Erreur lors du changement de statut de l'outil :", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [guildName, isActive, isSubmitting, toolId]);

    return {
        isActive,
        isSubmitting,
        toggleTool,
    };
}