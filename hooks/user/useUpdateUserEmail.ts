import { FormEvent, useState } from "react";
import FetchManager from "@/managers/FetchManager";

export default function useUpdateEmail(onSuccess?: () => void) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasChanged = newEmail.trim().length > 0 || confirmEmail.trim().length > 0 || currentPassword.trim().length > 0;

    const reset = () => {
        setCurrentPassword("");
        setNewEmail("");
        setConfirmEmail("");
        setErrorMessage(null);
    };

    const submit = async (event?: FormEvent<HTMLFormElement>): Promise<boolean> => {
        event?.preventDefault();

        try {
            setErrorMessage(null);

            const trimmedCurrentPassword = currentPassword.trim();
            const trimmedNewEmail = newEmail.trim();
            const trimmedConfirmEmail = confirmEmail.trim();

            if (!trimmedCurrentPassword) {
                setErrorMessage("Le mot de passe actuel est requis.");
                return false;
            }

            if (!trimmedNewEmail) {
                setErrorMessage("Le nouvel email est requis.");
                return false;
            }

            if (!trimmedConfirmEmail) {
                setErrorMessage("La confirmation du nouvel email est requise.");
                return false;
            }

            if (trimmedNewEmail === trimmedCurrentPassword) {
                setErrorMessage("Le nouvel email doit être différent de l'email actuel.");
                return false;
            }

            if (trimmedNewEmail !== trimmedConfirmEmail) {
                setErrorMessage("La confirmation du nouvel email ne correspond pas.");
                return false;
            }

            setIsLoading(true);

            await FetchManager.fetch("/api/user/update/email", {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword: trimmedCurrentPassword,
                    newEmail: trimmedNewEmail,
                }),
            });

            reset();
            onSuccess?.();
            return true;
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la mise à jour de l'email."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        currentPassword,
        newEmail,
        confirmEmail,
        setCurrentPassword,
        setNewEmail,
        setConfirmEmail,
        isLoading,
        errorMessage,
        hasChanged,
        submit,
        reset,
    };
}