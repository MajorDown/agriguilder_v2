'use client';

import useUserContext from "@/contexts/userContext/useUserContext";
import useAdminDashboard from "@/hooks/dashboard/useAdminDashboard";
import styles from "@/styles/components/application/sections/adminDashboard.module.css";
import AppSpinner from "../../ui/AppSpinner";

export default function AdminDashboard() {
    const { selectedGuild } = useUserContext();
    const { data, isLoading, error } = useAdminDashboard(selectedGuild);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <section className={styles.dashboard}>
                <div className={styles.header}>
                    <h3>Vous administrez actuellement la guilde {selectedGuild ?? "non sélectionnée"}</h3>
                    <p>Chargement des données...</p>
                    <AppSpinner />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.dashboard}>
                <div className={styles.header}>
                    <h3>Vous administrez actuellement la guilde {selectedGuild ?? "non sélectionnée"}</h3>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.dashboard}>
            <div className={styles.header}>
                <h3>Vous administrez actuellement la guilde {selectedGuild ?? "non sélectionnée"}</h3>
                <p>
                    dernière initialisation des données :{" "}
                    {data?.lastInit ? formatDate(data.lastInit) : "..."}
                </p>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.top}>
                        <h3>{data?.members?.total ?? "..."}</h3>
                        <p>Membres inscrits</p>
                    </div>
                    <div className={styles.line}>
                        <p>dont ce mois-ci</p>
                        <p>{data?.members?.thisMonth ?? "..."}</p>
                    </div>
                    <div className={styles.line}>
                        <p>actifs</p>
                        <p>{data?.members?.actives ?? "..."}</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.top}>
                        <h3>{data?.tools?.total ?? "..."}</h3>
                        <p>Outils disponibles</p>
                    </div>
                    <div className={styles.line}>
                        <p>dont ce mois-ci</p>
                        <p>{data?.tools?.thisMonth ?? "..."}</p>
                    </div>
                    <div className={styles.line}>
                        <p>utilisés</p>
                        <p>{data?.tools?.used ?? "..."}</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.top}>
                        <h3>{data?.interventions?.total ?? "..."}</h3>
                        <p>Interventions</p>
                    </div>
                    <div className={styles.line}>
                        <p>dont ce mois-ci</p>
                        <p>{data?.interventions?.thisMonth ?? "..."}</p>
                    </div>
                    <div className={styles.line}>
                        <p>en attente de validation</p>
                        <p>{data?.interventions?.pending ?? "..."}</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.top}>
                        <h3>{data?.contestations?.total ?? "..."}</h3>
                        <p>Contestations</p>
                    </div>
                    <div className={styles.line}>
                        <p>dont ce mois-ci</p>
                        <p>{data?.contestations?.thisMonth ?? "..."}</p>
                    </div>
                    <div className={styles.line}>
                        <p>en attente d'arbitrage</p>
                        <p>{data?.contestations?.pending ?? "..."}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}