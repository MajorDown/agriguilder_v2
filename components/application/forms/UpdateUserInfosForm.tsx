'use client';

import AppBtn from "@/components/application/ui/buttons/AppBtn";
import useModal from "@/contexts/modalContext/useModal";
import useUpdateUserInfos from "@/hooks/user/useUpdateUserInfos";
import styles from "@/styles/pages/options.module.css";
import AppInput from "../ui/inputs/AppInput";

export type UpdateUserInfosFormProps = {
    onUpdated?: () => void;
};

export default function UpdateUserInfosForm(props: UpdateUserInfosFormProps) {
    const { closeModal } = useModal();

    const {
        firstname,
        lastname,
        phone,
        society,
        setFirstname,
        setLastname,
        setPhone,
        setSociety,
        isLoading,
        errorMessage,
        hasChanged,
        submit,
    } = useUpdateUserInfos(props.onUpdated);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const success = await submit(event);

        if (success) {
            closeModal();
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.line}>
                <AppInput 
                    label={"Votre Prénom :"} 
                    type={"text"} 
                    value={firstname} 
                    onChange={(value) => setFirstname(value)} 
                />
                <AppInput
                    label={"Votre Nom :"}
                    type={"text"}
                    value={lastname}
                    onChange={(value) => setLastname(value)}
                />
            </div>
            <div className={styles.line}>
                <AppInput
                    label={"Votre société :"}
                    type={"text"}
                    value={society}
                    onChange={(value) => setSociety(value)}
                />
                <AppInput
                    label={"Votre Téléphone :"}
                    type={"text"}
                    value={phone}
                    onChange={(value) => setPhone(value)}
                />
            </div>
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