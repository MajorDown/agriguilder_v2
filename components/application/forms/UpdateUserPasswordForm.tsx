'use client';
import AppBtn from "@/components/application/ui/buttons/AppBtn";
import AppInput from "../ui/inputs/AppInput";
import useModal from "@/contexts/modalContext/useModal";
import styles from "@/styles/pages/options.module.css";
import useUpdateUserPassword from "@/hooks/user/useUpdateUserPassword";

export type UpdateUserPasswordFormProps = {
    onUpdated?: () => void;
};

export default function UpdateUserPasswordForm(props: UpdateUserPasswordFormProps) {
    const { closeModal } = useModal();

    const {
        currentPassword,
        newPassword,
        confirmPassword,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        isLoading,
        errorMessage,
        submit,
    } = useUpdateUserPassword(props.onUpdated);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const success = await submit(event);

        if (success) {
            closeModal();
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <AppInput
                label={"Votre nouveau mot de passe :"}
                type={"password"}
                value={newPassword}
                onChange={(value) => setNewPassword(value)}
            />
            <AppInput
                label={"Confirmez :"}
                type={"password"}
                value={confirmPassword}
                onChange={(value) => setConfirmPassword(value)}
            />
            <AppInput
                label={"Votre actuel mot de passe :"}
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