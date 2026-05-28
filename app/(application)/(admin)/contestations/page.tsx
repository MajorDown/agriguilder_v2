'use client';
import AppPage from "@/components/application/ui/AppPage";
import ContestationTable from "@/components/application/sections/admin/ContestationTable";

export default function ContestationsPage() {
    return (
        <AppPage title="Gestion des contestations" requiredRole={["admin"]}>
            <ContestationTable />
        </AppPage>
    );
}