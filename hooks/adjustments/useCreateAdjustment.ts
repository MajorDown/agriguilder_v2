import { useState } from "react";
import useUserContext from "@/contexts/userContext/useUserContext";
import { AdjustmentReason } from "@/modules/adjustment/adjustment.types";
import FetchManager from "@/managers/FetchManager";

type CreateAdjustmentPayload = {
    memberId: string;
    amount: number;
    reason: AdjustmentReason;
};

export default function useCreateAdjustment(onSuccess?: () => void) {
    const { user, selectedGuild } = useUserContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    async function createAdjustment(payload: CreateAdjustmentPayload): Promise<void> {
        try {
            setIsLoading(true);
            setError("");

            if (!selectedGuild) {
                throw new Error("Aucune guilde sélectionnée.");
            }

            if (!user?.id) {
                throw new Error("Utilisateur non connecté.");
            }

            const response = await FetchManager.fetch("/api/adjustment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    guildName: selectedGuild,
                    memberId: payload.memberId,
                    adminId: user.id,
                    amount: payload.amount,
                    reason: payload.reason,
                    type: "CORRECTION",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Erreur lors de la création de l'ajustement.");
            }

            onSuccess?.();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Erreur inconnue.");
        } finally {
            setIsLoading(false);
        }
    }

    return {
        createAdjustment,
        isLoading,
        error,
    };
}