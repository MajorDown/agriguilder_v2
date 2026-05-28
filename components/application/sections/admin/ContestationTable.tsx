'use client';

import ContestationLine from "@/components/application/sections/admin/ContestationLine";
import styles from "@/styles/components/application/sections/contestationTable.module.css";
import useUserContext from "@/contexts/userContext/useUserContext";
import useGetGuildContestations from "@/hooks/contestations/useGetGuildContestations";

export default function ContestationTable() {
    const { selectedGuild } = useUserContext();

    const {
        contestations,
        isLoading,
        errorMessage,
        refreshContestations,
    } = useGetGuildContestations(selectedGuild ?? undefined);

    if (isLoading) {
        return (
            <section>
                <p>Chargement des contestations...</p>
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section>
                <p>{errorMessage}</p>
            </section>
        );
    }

    if (contestations.length === 0) {
        return (
            <section>
                <p>Aucune contestation trouvée.</p>
            </section>
        );
    }

    return (
        <section>
            <div id={styles.tableHeader}>
                <p>date de contestation</p>
                <p>date d'intervention</p>
                <p>contestataire</p>
                <p>raison</p>
                <p>statut</p>
            </div>

            {contestations.map((contestation) => (
                <ContestationLine
                    key={contestation.id}
                    contestation={contestation}
                    onResolveContestation={refreshContestations}
                />
            ))}
        </section>
    );
}