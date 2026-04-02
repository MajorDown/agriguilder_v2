'use client';
import AdminDashboard from "@/components/application/sections/admin/AdminDashboard";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function DashboardPage() {
    const { selectedRole } = useUserContext();

    return (<AppPage title="Tableau de bord" requiredRole={['membre', 'admin', 'employé']}>
        {selectedRole === 'admin' && <AdminDashboard />}
    </AppPage>);
}

