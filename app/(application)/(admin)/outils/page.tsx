'use client';
import AdminDashboard from "@/components/application/sections/admin/AdminDashboard";
import ToolTable from "@/components/application/sections/admin/ToolTable";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function ToolsPage() {
    const { selectedGuild } = useUserContext();

    return (<AppPage title="Les Outils de la guilde" requiredRole={['admin']}>
        <ToolTable guildName={selectedGuild ?? "non sélectionnée"} />
    </AppPage>);
}

