'use client';
import UserOptions from "@/components/application/sections/UserOptions";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function OptionsPage() {
    const { user } = useUserContext();

    return (
        <AppPage title="Options de l'utilisateur" requiredRole={["user"]}>
            <UserOptions />
        </AppPage>
    );
}