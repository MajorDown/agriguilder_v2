'use client';
import CreateGuildWithFirstAdminForm from "@/components/application/forms/CreateGuildWithFirstAdminForm";
import AppPage from "@/components/application/ui/AppPage";

export default function InscriptionPage() {

    return (
        <AppPage title="Inscription d'une nouvelle guilde" forDev>
            <CreateGuildWithFirstAdminForm />
        </AppPage>
    );
}
