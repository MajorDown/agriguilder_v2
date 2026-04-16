'use client';
import AppPage from "@/components/application/ui/AppPage";
import InterventionTable from "@/components/application/sections/admin/InterventionTable";

export default function HistoriquePage() {

    return (
        <AppPage title="Historique des interventions" requiredRole={["membre"]}>
            <InterventionTable />
        </AppPage>
    );
}