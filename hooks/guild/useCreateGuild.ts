"use client";

import { useState } from "react";
import FetchManager from "@/managers/FetchManager";
import type { CreateGuildInput, CreatedGuild } from "@/modules/guild/guild.types";

type UseCreateGuildReturn = {
    isLoading: boolean;
    error: string | null;
    createdGuild: CreatedGuild | null;
    create: (input: CreateGuildInput) => Promise<CreatedGuild | null>;
    reset: () => void;
};

function readApiError(body: any, fallback: string): string {
    return body?.error?.message ?? body?.message ?? fallback;
}

export default function useCreateGuild(): UseCreateGuildReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdGuild, setCreatedGuild] = useState<CreatedGuild | null>(null);

    async function create(input: CreateGuildInput): Promise<CreatedGuild | null> {
        try {
            setIsLoading(true);
            setError(null);

            const response = await FetchManager.fetch("/api/guild/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const body = await response.json();

            if (!response.ok) {
                throw new Error(readApiError(body, "Erreur lors de la création de la guilde"));
            }

            setCreatedGuild(body.data);
            return body.data;
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur inconnue lors de la création de la guilde";

            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        setIsLoading(false);
        setError(null);
        setCreatedGuild(null);
    }

    return {
        isLoading,
        error,
        createdGuild,
        create,
        reset,
    };
}
