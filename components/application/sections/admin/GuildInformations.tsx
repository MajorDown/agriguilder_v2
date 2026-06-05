'use client';

import CreateAdminForm from "@/components/application/forms/CreateAdminForm";
import CreateReinitializationForm from "@/components/application/forms/CreateReinitializationForm";
import AppBtn from "@/components/application/ui/buttons/AppBtn";
import useModal from "@/contexts/modalContext/useModal";
import useUserContext from "@/contexts/userContext/useUserContext";
import { PublicGuildWithRules } from "@/modules/guild/guild.types";
import styles from "@/styles/pages/rules.module.css";

export type GuildInformationsProps = {
    guild: PublicGuildWithRules;
    onGuildUpdated?: () => Promise<void>;
};

export default function GuildInformations(props: GuildInformationsProps) {
    const { openModal, closeModal } = useModal();
    const { selectedRole } = useUserContext();

    const handleOpenCreateAdminModal = () => {
        openModal({
            title: "Créer un nouvel admin",
            size: "medium",
            content: (
                <CreateAdminForm
                    guildName={props.guild.name}
                    onSuccess={async () => {
                        closeModal();
                        await props.onGuildUpdated?.();
                    }}
                />
            ),
        });
    };

    const handleOpenReinitializationModal = () => {
        openModal({
            title: "Réinitialiser la guilde",
            size: "large",
            content: (
                <CreateReinitializationForm
                    guild={props.guild}
                    onGuildUpdated={props.onGuildUpdated}
                />
            ),
        });
    };

    return (
        <section>
            <h3>paramétrages</h3>
            <p>
                l&apos;ensemble des paramètres de la guilde sont définis lors de sa création.
                Ils peuvent être modifiés au moment de la réinitialisation (remise à zéro des compteurs)
            </p>
            {selectedRole === "admin" && (
                <AppBtn
                    label="Lancer une réinitialisation"
                    color="light"
                    onClick={handleOpenReinitializationModal}
                />
            )}
            <div className={styles.line}>
                <div className={styles.column}>
                    <p>Nom de la guilde :</p>
                    <p>{props.guild.name}</p>
                </div>
                <div className={styles.column}>
                    <p>Domiciliation :</p>
                    <p>{props.guild.city}, {props.guild.department}</p>
                </div>
                <div className={styles.column}>
                    <p>Valeur en Guilders (⋈) de l&apos;heure humaine :</p>
                    <p>{props.guild.human_hour_point_value}⋈</p>
                </div>
            </div>
            <div className={styles.line}>
                <div className={styles.column}>
                    <p>Délai maximal de déclaration :</p>
                    <p>{props.guild.max_declaration_delay} jours après intervention</p>
                </div>
                <div>
                    <p>Délai maximal de contestation :</p>
                    <p>{props.guild.max_contestation_delay} jours après déclaration</p>
                </div>
            </div>
            <div className={styles.line}>
                <div className={styles.column}>
                    <p>Délai maximal de validation : {props.guild.max_validation_delay} jours après déclaration</p>
                    {props.guild.max_validation_delay === 0 && (
                        <p>(La validation se fera automatiquement après la déclaration)</p>
                    )}
                </div>
            </div>
            <div className={styles.line}>
                <div className={styles.column}>
                    <p>Administrateurs :</p>
                    {props.guild.admins.length > 0 ? (
                        props.guild.admins.map((admin) => (
                            <p key={admin.id}>
                                {admin.user.firstname} {admin.user.lastname} - {admin.user.email}
                            </p>
                        ))
                    ) : (
                        <p>Aucun admin actif.</p>
                    )}
                </div>
            </div>
            {selectedRole === "admin" && (
                <AppBtn
                    label="Créer un nouvel admin"
                    color="light"
                    onClick={handleOpenCreateAdminModal}
                />
            )}
        </section>
    );
}
