'use client';
import { useState } from "react";

export function useLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data?.message || "Connexion impossible");
                return;
            }
            window.location.href = "/";
        } catch {
            setError("Une erreur est survenue lors de la connexion");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleSubmit,
    };
}