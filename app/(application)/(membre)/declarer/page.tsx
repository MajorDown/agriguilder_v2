'use client';
import CreateInterventionForm from "@/components/application/forms/CreateInterventionForm";
import MembersTable from "@/components/application/sections/admin/MemberTable";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function DeclarePage() {
    const { selectedGuild } = useUserContext();

    return (
        <AppPage title="Déclarer une intervention" requiredRole={["membre"]}>
            <CreateInterventionForm />
        </AppPage>
    );
}