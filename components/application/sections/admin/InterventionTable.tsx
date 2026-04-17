'use client';

import InterventionLine from "@/components/application/sections/admin/InterventionLine";
import styles from "@/styles/components/application/sections/interventionTable.module.css";
import useUserContext from "@/contexts/userContext/useUserContext";
import useMemberInterventions from "@/hooks/interventions/useGetInterventionsByMember";

export default function InterventionTable() {
    const { user, selectedGuild, selectedRole } = useUserContext();

    const {
        interventions,
        isLoading,
        errorMessage,
        refreshInterventions,
    } = useMemberInterventions(selectedGuild ?? undefined);

    if (isLoading) {
        return (
            <section>
                <p>Chargement des interventions...</p>
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

    if (interventions.length === 0) {
        return (
            <section>
                <p>Aucune intervention trouvée.</p>
            </section>
        );
    }

    return (
        <section>
            <div id={styles.tableHeader}>
                <p>date d'intervention</p>
                <p>date de déclaration</p>
                <p>intervenant</p>
                <p>bénéficiaire</p>
                <p>valeure</p>
                <p>statut</p>
            </div>

            {interventions.map((intervention) => (
                <InterventionLine
                    key={intervention.id}
                    intervention={intervention}
                    actualUserEmail={selectedRole === "membre" ? user?.email : undefined}
                />
            ))}
        </section>
    );
}