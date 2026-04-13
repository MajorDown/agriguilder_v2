'use client';

import { FormEvent } from "react";
import AppBtn from "@/components/application/ui/buttons/AppBtn";
import useCreateRule from "@/hooks/rules/useCreateRule";
import useModal from "@/contexts/modalContext/useModal";
import styles from "@/styles/pages/rules.module.css";

export type CreateRuleFormProps = {
    guildName: string;
    onCreate?: () => void;
};

export default function CreateRuleForm(props: CreateRuleFormProps) {
    const { closeModal } = useModal();

    const {
        content,
        isLoading,
        errorMessage,
        setContent,
        submitCreate,
    } = useCreateRule({
        guildName: props.guildName,
        onCreate: props.onCreate,
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const success = await submitCreate();

        if (success) {
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSubmit} id={styles.createRuleForm}>
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={isLoading}
                placeholder="Rédiger une nouvelle règle"
                rows={3}
            />

            {errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
            )}
                <AppBtn
                    type="submit"
                    onClick={() => {}}
                    label={isLoading ? "Création..." : "Créer la règle"}
                    color="dark"
                />
        </form>
    );
}