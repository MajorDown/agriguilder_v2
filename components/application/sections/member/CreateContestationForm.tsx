'use client';

import { FormEvent, useState } from "react";
import AppBtn from "../../ui/buttons/AppBtn";
import useUserContext from "@/contexts/userContext/useUserContext";
import useCreateContestation from "@/hooks/contestations/useCreateContestation";
import styles from "@/styles/components/application/sections/interventionTable.module.css";

export type CreateContestationFormProps = {
    interventionId: string;
    guildName: string;
};

export default function CreateContestationForm(props: CreateContestationFormProps) {
    const { user } = useUserContext();
    const [reason, setReason] = useState("");

    const {
        isLoading,
        errorMessage,
        successMessage,
        createContestation,
    } = useCreateContestation();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedReason = reason.trim();

        if (!trimmedReason) {
            return;
        }

        const success = await createContestation(
            {
                interventionId: props.interventionId,
                guildName: props.guildName,
                reason: trimmedReason,
            }, 
            user!.id
        );

        if (success) {
            setReason("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.contestationForm}>
            <label htmlFor="reason">Raison de la contestation</label>
            <textarea
                id="reason"
                name="reason"
                rows={4}
                cols={50}
                placeholder="Expliquez pourquoi vous contestez cette intervention..."
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                disabled={isLoading}
            />
            {errorMessage && <p className={'error'}>{errorMessage}</p>}
            {successMessage && <p className={'success'}>{successMessage}</p>}
            <AppBtn
                label={isLoading ? "Envoi en cours..." : "Confirmer la contestation"}
                color={"dark"}
                type={"submit"}
            />
        </form>
    );
}