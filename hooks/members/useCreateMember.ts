import { useState } from "react";
import type { CreateMemberInput, PublicMember } from "@/modules/member/member.types";
import FetchManager from "@/managers/FetchManager";

type UseCreateMemberReturn = {
    isLoading: boolean;
    error: string | null;
    createdMember: PublicMember | null;
    create: (input: CreateMemberInput) => Promise<PublicMember | null>;
    reset: () => void;
};

export default function useCreateMember(): UseCreateMemberReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdMember, setCreatedMember] = useState<PublicMember | null>(null);

    async function create(input: CreateMemberInput): Promise<PublicMember | null> {
        try {
            setIsLoading(true);
            setError(null);
            setCreatedMember(null);

            const response = await FetchManager.fetch("/api/member/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json?.message || "Erreur lors de la création du membre");
            }

            setCreatedMember(json.data);
            return json.data;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur inconnue lors de la création du membre";

            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        setError(null);
        setCreatedMember(null);
        setIsLoading(false);
    }

    return {
        isLoading,
        error,
        createdMember,
        create,
        reset,
    };
}