'use client';
import ToolTable from "@/components/application/sections/admin/ToolTable";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function GestionPage() {
    const { selectedGuild } = useUserContext();

    return (
        <AppPage title="Gestion de l'application">
            <p>en cours</p>
        </AppPage>
    );
}