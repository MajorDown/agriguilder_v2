'use client';
import MembersTable from "@/components/application/sections/admin/MemberTable";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function MembersPage() {
    const { selectedGuild } = useUserContext();

    return (
        <AppPage title="Les Membres de la guilde" requiredRole={["admin"]}>
            <MembersTable guildName={selectedGuild ?? ""} />
        </AppPage>
    );
}