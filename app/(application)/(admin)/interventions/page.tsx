'use client';
import AppCalendar from "@/components/application/ui/AppCalendar";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function InterventionsPage() {
    const { selectedGuild } = useUserContext();

    return (
        <AppPage title="Historique des interventions" requiredRole={["admin"]}>
            <AppCalendar 
                initialMonth={new Date().getMonth()} 
                initialYear={new Date().getFullYear()}
            />
        </AppPage>
    );
}