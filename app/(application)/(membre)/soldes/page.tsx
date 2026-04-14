'use client';
import MembersTable from "@/components/application/sections/admin/MemberTable";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function SoldesPage() {
    const { selectedGuild } = useUserContext();

    return (
        <AppPage title="Consulter les soldes" requiredRole={["membre"]}>
            <MembersTable guildName={selectedGuild ?? ""} isAdminView={false} />
        </AppPage>
    );
}