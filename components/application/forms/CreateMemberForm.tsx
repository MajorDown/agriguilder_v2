import AppBtn from "../ui/buttons/AppBtn";
import AppInput from "../ui/inputs/AppInput";
import useCreateMemberForm from "@/hooks/members/useCreateMemberForm";
import styles from "@/styles/components/application/sections/membersTable.module.css";

export type CreateMemberFormProps = {
    guildName: string;
    onSuccess: () => void;
};

export default function CreateMemberForm(props: CreateMemberFormProps) {
    const {
        step,
        values,
        setField,
        checkEmail,
        submit,
        goBackToEmailStep,
        checkLoading,
        createLoading,
        error,
    } = useCreateMemberForm({
        guildName: props.guildName,
        onSuccess: props.onSuccess,
    });

    return (
        <form id={styles.form} onSubmit={(e) => e.preventDefault()}>
            {step === "email" && (
                <>
                    <p>Dans un premier temps, renseignez l’email du nouveau membre.</p>
                    <p>Celui-ci existe peut-être déjà dans notre base de données.</p>
                    <AppInput
                        type="email"
                        label="Son email :"
                        name="email"
                        placeholder="Entrez l'email du membre"
                        value={values.email}
                        onChange={(value) => setField("email", value)}
                    />
                    {error && <p>{error}</p>}
                    <AppBtn
                        label={checkLoading ? "Vérification..." : "Vérifier l'email"}
                        color="dark"
                        onClick={checkEmail}
                    />
                </>
            )}

            {step === "details" && (
                <>
                    <p>Renseignez les informations du membre.</p>
                    <AppInput
                        type="text"
                        label="Prénom :"
                        name="firstname"
                        placeholder="Entrez le prénom"
                        value={values.firstname}
                        onChange={(value) => setField("firstname", value)}
                    />
                    <AppInput
                        type="text"
                        label="Nom :"
                        name="lastname"
                        placeholder="Entrez le nom"
                        value={values.lastname}
                        onChange={(value) => setField("lastname", value)}
                    />
                    <AppInput
                        type="text"
                        label="Téléphone :"
                        name="phone"
                        placeholder="Entrez le téléphone"
                        value={values.phone}
                        onChange={(value) => setField("phone", value)}
                    />
                    <AppInput
                        type="text"
                        label="Société :"
                        name="society"
                        placeholder="Entrez la société"
                        value={values.society}
                        onChange={(value) => setField("society", value)}
                    />
                    {error && <p>{error}</p>}
                    <AppBtn
                        label={createLoading ? "Création..." : "Créer le membre"}
                        color="dark"
                        onClick={submit}
                    />
                </>
            )}
        </form>
    );
}