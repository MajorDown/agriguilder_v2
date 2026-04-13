import { FormEvent, useState } from "react";
import FetchManager from "@/managers/FetchManager";

export default function useUpdatePassword(onSuccess?: () => void) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasChanged = newPassword.trim().length > 0 || confirmPassword.trim().length > 0 || currentPassword.trim().length > 0;

    const reset = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage(null);
    };

    const submit = async (event?: FormEvent<HTMLFormElement>): Promise<boolean> => {
        event?.preventDefault();

        try {
            setErrorMessage(null);

            const trimmedCurrentPassword = currentPassword.trim();
            const trimmedNewPassword = newPassword.trim();
            const trimmedConfirmPassword = confirmPassword.trim();

            if (!trimmedCurrentPassword) {
                setErrorMessage("Le mot de passe actuel est requis.");
                return false;
            }

            if (!trimmedNewPassword) {
                setErrorMessage("Le nouveau mot de passe est requis.");
                return false;
            }

            if (!trimmedConfirmPassword) {
                setErrorMessage("La confirmation du nouveau mot de passe est requise.");
                return false;
            }

            if (trimmedNewPassword === trimmedCurrentPassword) {
                setErrorMessage("Le nouveau mot de passe doit être différent du mot de passe actuel.");
                return false;
            }

            if (trimmedNewPassword !== trimmedConfirmPassword) {
                setErrorMessage("La confirmation du nouveau mot de passe ne correspond pas.");
                return false;
            }

            setIsLoading(true);

            await FetchManager.fetch("/api/user/update/password", {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword: trimmedCurrentPassword,
                    newPassword: trimmedNewPassword,
                }),
            });

            reset();
            onSuccess?.();
            return true;
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la mise à jour du mot de passe."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        currentPassword,
        newPassword,
        confirmPassword,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        isLoading,
        errorMessage,
        hasChanged,
        submit,
        reset,
    };
}