'use client';
import styles from "@/styles/pages/options.module.css";
import AppBtn from "../ui/buttons/AppBtn";
import useUserContext from "@/contexts/userContext/useUserContext";
import useModal from "@/contexts/modalContext/useModal";
import UpdateUserInfosForm from "@/components/application/forms/UpdateUserInfosForm";
import UpdateUserEmailForm from "@/components/application/forms/UpdateUserEmailForm";
import UpdateUserPasswordForm from "@/components/application/forms/UpdateUserPasswordForm";

export default function UserOptions() {
    const { user, refreshUser } = useUserContext();
    const { openModal } = useModal();

    const handleOpenUpdateInfosModal = () => {
        openModal({
            title: "Modifier vos informations",
            size: "medium",
            content: (
                <UpdateUserInfosForm onUpdated={refreshUser} />
            ),
        });
    };

    const handleOpenUpdateEmailModal = () => {
        openModal({
            title: "Modifier votre adresse email",
            size: "medium",
            content: (
                <UpdateUserEmailForm onUpdated={refreshUser} />
            ),
        });
    };

    const handleOpenUpdatePasswordModal = () => {
        openModal({
            title: "Modifier votre mot de passe",
            size: "medium",
            content: (
                <UpdateUserPasswordForm onUpdated={refreshUser} />
            ),
        });
    }

    return (
        <section>
            <div id={styles.infos}>
                <p>votre identifiant : {user?.id}</p>
                <p>votre nom : {user?.firstname} {user?.lastname}</p>
                <p>votre téléphone : {user?.phone}</p>
                <p>le nom de votre entreprise : {user?.society}</p>
                <AppBtn
                    label={"modifier vos informations"}
                    color={"light"}
                    onClick={handleOpenUpdateInfosModal}
                />
            </div>
            <div id={styles.email}>
                <p>votre adresse email : {user?.email}</p>
                <AppBtn 
                    label={"modifier votre adresse email"} 
                    color={"light"} 
                    onClick={handleOpenUpdateEmailModal}
                />
            </div>
            <div id={styles.password}>
                <AppBtn
                    label={"modifier votre mot de passe"}
                    color={"light"}
                    onClick={handleOpenUpdatePasswordModal}
                />
            </div>
        </section>
    );
}