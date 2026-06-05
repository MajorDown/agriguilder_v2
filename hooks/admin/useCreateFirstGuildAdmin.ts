"use client";

import { useState } from "react";
import FetchManager from "@/managers/FetchManager";
import type { CreateFirstGuildAdminInput, CreatedFirstGuildAdmin } from "@/modules/admin/admin.types";

type UseCreateFirstGuildAdminReturn = {
    isLoading: boolean;
    error: string | null;
    createdAdmin: CreatedFirstGuildAdmin | null;
    create: (input: CreateFirstGuildAdminInput) => Promise<CreatedFirstGuildAdmin | null>;
    reset: () => void;
};

function readApiError(body: any, fallback: string): string {
    return body?.error?.message ?? body?.message ?? fallback;
}

export default function useCreateFirstGuildAdmin(): UseCreateFirstGuildAdminReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdAdmin, setCreatedAdmin] = useState<CreatedFirstGuildAdmin | null>(null);

    async function create(input: CreateFirstGuildAdminInput): Promise<CreatedFirstGuildAdmin | null> {
        try {
            setIsLoading(true);
            setError(null);

            const response = await FetchManager.fetch("/api/admin/create-first", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const body = await response.json();

            if (!response.ok) {
                throw new Error(readApiError(body, "Erreur lors de la création du premier admin"));
            }

            setCreatedAdmin(body.data);
            return body.data;
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur inconnue lors de la création du premier admin";

            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        setIsLoading(false);
        setError(null);
        setCreatedAdmin(null);
    }

    return {
        isLoading,
        error,
        createdAdmin,
        create,
        reset,
    };
}
