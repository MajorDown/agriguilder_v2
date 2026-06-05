"use client";

import { useState } from "react";
import FetchManager from "@/managers/FetchManager";
import type { CreateAdminInput, CreatedAdmin } from "@/modules/admin/admin.types";

type UseCreateAdminReturn = {
    isLoading: boolean;
    error: string | null;
    createdAdmin: CreatedAdmin | null;
    create: (input: CreateAdminInput) => Promise<CreatedAdmin | null>;
    reset: () => void;
};

export default function useCreateAdmin(): UseCreateAdminReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdAdmin, setCreatedAdmin] = useState<CreatedAdmin | null>(null);

    async function create(input: CreateAdminInput): Promise<CreatedAdmin | null> {
        try {
            setIsLoading(true);
            setError(null);
            setCreatedAdmin(null);

            const response = await FetchManager.fetch("/api/admin/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const json = await response.json();

            if (!response.ok) {
                const message =
                    json?.error?.message ||
                    json?.message ||
                    "Erreur lors de la création de l'admin";

                throw new Error(message);
            }

            setCreatedAdmin(json.data);
            return json.data;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur inconnue lors de la création de l'admin";

            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        setError(null);
        setCreatedAdmin(null);
        setIsLoading(false);
    }

    return {
        isLoading,
        error,
        createdAdmin,
        create,
        reset,
    };
}
