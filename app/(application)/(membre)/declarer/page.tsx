'use client';
import CreateInterventionForm from "@/components/application/forms/CreateInterventionForm";
import AppPage from "@/components/application/ui/AppPage";

export default function DeclarePage() {

    return (
        <AppPage title="Déclarer une intervention" requiredRole={["membre"]}>
            <CreateInterventionForm />
        </AppPage>
    );
}