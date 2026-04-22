'use client';

import useUserContext from "@/contexts/userContext/useUserContext";
import styles from "@/styles/components/application/sections/memberDashboard.module.css";
import AppSpinner from "../../ui/AppSpinner";
import useMemberDashboard from "@/hooks/dashboard/useMemberDashboard";

export default function MemberDashboard() {
    const { user, selectedGuild } = useUserContext();
    const { data, isLoading, error } = useMemberDashboard(selectedGuild, user?.id || null);

    if (isLoading) {
        return (
            <section className={styles.dashboard}>
                <p>Chargement du tableau de bord...</p>
                <AppSpinner />
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.dashboard}>
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className={styles.dashboard}>
            <h3>Votre solde au {new Date().toLocaleDateString()} : {data?.pointsBalance}⋈</h3>
            <p>(sous réserve de calculs de vérification effectués chaque soir à 23h59)</p>
            <div className={styles.card}>
                <h4>Interventions qui vous concernent</h4>
                <p>Total : {data?.interventions.total}</p>
                <p>déclarées ce mois-ci : {data?.interventions.thisMonth}</p>
                <p>déclaration de votre part : {data?.interventions.asWorker}</p>
                <p>dont en attente d'une validation : {data?.interventions.pendingOtherValidation}</p>
                <p>autre déclarations : {data?.interventions.asPayer}</p>
                <p>en attente de votre validation : {data?.interventions.pendingMyValidation}</p>
            </div>
            <div className={styles.card}>
                <h4>Outils utilisés</h4>
                <p>Total : {data?.tools.total}</p>
                <p>dont ce mois-ci : {data?.tools.thisMonth}</p>
                <p>les plus utilisés :{data?.tools.top3.first}, {data?.tools.top3.second}, {data?.tools.top3.third}</p>
            </div>
            <div className={styles.card}>
                <h4>Contestations</h4>
                <p>Total : {data?.contestations.total}</p>
                <p>dont ce mois-ci : {data?.contestations.thisMonth}</p>
                <p>de votre part : {data?.contestations.fromMe}</p>
                <p>En attente de traitement : {data?.contestations.pending}</p>
            </div>
        </section>
    );
}