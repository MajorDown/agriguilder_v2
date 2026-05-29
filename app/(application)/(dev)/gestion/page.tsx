'use client';
import GuildTable from "@/components/application/sections/dev/GuildTable";
import AppPage from "@/components/application/ui/AppPage";

export default function GestionPage() {

    return (
        <AppPage title="Gestion de l'application" forDev>
            <GuildTable />
        </AppPage>
    );
}