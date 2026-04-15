'use client';

import MemberSelect from "@/components/application/ui/inputs/MemberSelect";
import AppDateInput from "@/components/application/ui/inputs/AppDateInput";
import AppDurationInput from "@/components/application/ui/inputs/AppDurationInput";
import ToolSelector from "../ui/inputs/ToolSelector";
import AppBtn from "../ui/buttons/AppBtn";
import useUserContext from "@/contexts/userContext/useUserContext";
import useCreateIntervention from "@/hooks/interventions/useCreateIntervention";
import styles from "@/styles/pages/declarer.module.css";

export type CreateInterventionFormProps = {
    onCreated?: () => void;
};

export default function CreateInterventionForm(props: CreateInterventionFormProps) {
    const { selectedGuild } = useUserContext();

    const {
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
        successMessage,
        submit,
    } = useCreateIntervention({
        onSuccess: props.onCreated,
    });

    return (
        <section>
            <form id={styles.form} onSubmit={submit}>
                <p id={styles.formDescription}>
                    Utilisez ce formulaire pour déclarer une intervention auprès de la guilde {selectedGuild}
                </p>

                <MemberSelect
                    selectedMemberId={selectedMemberId}
                    onChange={setSelectedMemberId}
                />

                <AppDateInput
                    value={selectedDate}
                    onChange={setSelectedDate}
                    maxDaysPast={7}
                    label="Date de l'intervention :"
                />

                <AppDurationInput
                    value={selectedDuration}
                    onChange={setSelectedDuration}
                    label="Durée de l'intervention :"
                />

                <ToolSelector
                    selectedTools={selectedTools}
                    onChange={setSelectedTools}
                />

                <div id={styles.description}>
                    <label htmlFor="description">
                        Description de l'intervention (facultatif) :
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        placeholder="semis de blé dans la parcelle nord"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={4}
                        cols={50}
                        disabled={isLoading}
                    />
                </div>

                {successMessage && (
                    <p className={styles.successMessage}>{successMessage}</p>
                )}

                {errorMessage && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                )}

                <AppBtn
                    color="dark"
                    type="submit"
                    label={isLoading ? "Déclaration..." : "Déclarer l'intervention"}
                />
            </form>
        </section>
    );
}