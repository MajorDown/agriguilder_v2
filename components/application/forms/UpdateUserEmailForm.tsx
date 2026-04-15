'use client';

import AppBtn from "@/components/application/ui/buttons/AppBtn";
import AppInput from "../ui/inputs/AppInput";
import useModal from "@/contexts/modalContext/useModal";
import styles from "@/styles/pages/options.module.css";
import useUpdateUserEmail from "@/hooks/user/useUpdateUserEmail";

export type UpdateUserEmailFormProps = {
    onUpdated?: () => void;
};

export default function UpdateUserEmailForm(props: UpdateUserEmailFormProps) {
    const { closeModal } = useModal();

    const {
        currentPassword,
        newEmail,
        confirmEmail,
        setCurrentPassword,
        setNewEmail,
        setConfirmEmail,
        isLoading,
        errorMessage,
        submit,
    } = useUpdateUserEmail(props.onUpdated);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const success = await submit(event);

        if (success) {
            closeModal();
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <AppInput
                label={"Votre nouvel email :"}
                type={"email"}
                value={newEmail}
                onChange={(value) => setNewEmail(value)}
            />
            <AppInput
                label={"Confirmez :"}
                type={"email"}
                value={confirmEmail}
                onChange={(value) => setConfirmEmail(value)}
            />
            <AppInput
                label={"Votre mot de passe :"}
                type={"password"}
                value={currentPassword}
                onChange={(value) => setCurrentPassword(value)}
            />
            {errorMessage && (
                <p className={"error"}>{errorMessage}</p>
            )}

            <div className={styles.actions}>
                <AppBtn
                    type="submit"
                    label={isLoading ? "Enregistrement..." : "Enregistrer"}
                    color="dark"
                />
            </div>
        </form>
    );
}