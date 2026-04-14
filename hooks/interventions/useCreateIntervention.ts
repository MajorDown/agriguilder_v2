import { FormEvent, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import useUserContext from "@/contexts/userContext/useUserContext";

export type UseCreateInterventionFormParams = {
    onSuccess?: () => void;
};

export default function useCreateInterventionForm(
    params?: UseCreateInterventionFormParams
) {
    const { user,selectedGuild } = useUserContext();

    const [selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedDuration, setSelectedDuration] = useState<number>(0);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [description, setDescription] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const reset = () => {
        setSelectedMemberId("");
        setSelectedDate("");
        setSelectedDuration(0);
        setSelectedTools([]);
        setDescription("");
        setErrorMessage(null);
    };

    const submit = async (
        event?: FormEvent<HTMLFormElement>
    ): Promise<boolean> => {
        event?.preventDefault();

        try {
            setErrorMessage(null);

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

            setIsLoading(true);

            await FetchManager.fetch("/api/intervention/create", {
                method: "POST",
                body: JSON.stringify({
                    guildName: selectedGuild,
                    workerId: user?.id,
                    payerId: selectedMemberId,
                    day: selectedDate,
                    duration: selectedDuration,
                    tools: selectedTools,
                    description: description.trim() || null,
                }),
            });

            reset();
            params?.onSuccess?.();

            return true;
        } catch (error) {
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
        selectedTools,
        description,

        setSelectedMemberId,
        setSelectedDate,
        setSelectedDuration,
        setSelectedTools,
        setDescription,

        isLoading,
        errorMessage,

        submit,
        reset,
    };
}