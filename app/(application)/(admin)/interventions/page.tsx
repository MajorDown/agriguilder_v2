'use client';
import AppCalendar from "@/components/application/ui/AppCalendar";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function InterventionsPage() {
    const { selectedGuild } = useUserContext();

    const interventions = [
        {
            id: "1",
            day: new Date(),
        },
        {
            id: "2",
            day: new Date(new Date().setDate(new Date().getDate() - 3)),
        },
        {
            id: "3",
            day: new Date(new Date().setDate(new Date().getDate() - 10)),
        },
    ]

    return (
        <AppPage title="Historique des interventions" requiredRole={["admin"]}>
            <AppCalendar 
                initialMonth={new Date().getMonth()} 
                initialYear={new Date().getFullYear()} 
                interventions={interventions}
            />
        </AppPage>
    );
}