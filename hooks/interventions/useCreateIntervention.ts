import { FormEvent, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import useUserContext from "@/contexts/userContext/useUserContext";

export type UseCreateInterventionFormParams = {
    onSuccess?: () => void;
};

export default function useCreateInterventionForm(
    params?: UseCreateInterventionFormParams
) {
    const { selectedGuild } = useUserContext();

    const [selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedDuration, setSelectedDuration] = useState<number>(0);
    const [ selectedSurface, setSelectedSurface ] = useState<number>(0);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const resetForm = () => {
        setSelectedMemberId("");
        setSelectedDate("");
        setSelectedDuration(0);
        setSelectedSurface(0);
        setSelectedTools([]);
        setDescription("");
    };

    const resetMessages = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const reset = () => {
        resetForm();
        resetMessages();
    };

    const submit = async (
        event?: FormEvent<HTMLFormElement>
    ): Promise<boolean> => {
        event?.preventDefault();

        try {
            setIsLoading(true);
            resetMessages();

            if (!selectedGuild) {
                setErrorMessage("Aucune guilde sélectionnée.");
                return false;
            }

            if (!selectedMemberId.trim()) {
                setErrorMessage("Veuillez sélectionner un membre.");
                return false;
            }

            if (!selectedDate.trim()) {
                setErrorMessage("Veuillez sélectionner une date d'intervention.");
                return false;
            }

            if (selectedDuration <= 0) {
                setErrorMessage("La durée de l'intervention doit être supérieure à 0.");
                return false;
            }

            await FetchManager.fetch("/api/intervention/create", {
                method: "POST",
                body: JSON.stringify({
                    guildName: selectedGuild,
                    payerId: selectedMemberId,
                    day: selectedDate,
                    duration: selectedDuration,
                    surface: selectedSurface,
                    tools: selectedTools,
                    description: description.trim() || null,
                }),
            });

            resetForm();
            setSuccessMessage("L'intervention a bien été déclarée.");
            params?.onSuccess?.();

            return true;
        } catch (error) {
            setSuccessMessage(null);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la création de l'intervention."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        selectedMemberId,
        selectedDate,
        selectedDuration,
        selectedSurface,
        selectedTools,
        description,

        setSelectedMemberId,
        setSelectedDate,
        setSelectedDuration,
        setSelectedSurface,
        setSelectedTools,
        setDescription,

        isLoading,
        errorMessage,
        successMessage,

        submit,
        reset,
        resetForm,
        resetMessages,
    };
}