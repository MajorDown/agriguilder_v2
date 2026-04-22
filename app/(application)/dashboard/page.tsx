'use client';
import AdminDashboard from "@/components/application/sections/admin/AdminDashboard";
import MemberDashboard from "@/components/application/sections/member/MemberDashboard";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function DashboardPage() {
    const { selectedRole } = useUserContext();

    return (<AppPage title="Tableau de bord" requiredRole={['admin', 'membre', 'employé']}>
        {selectedRole === 'admin' && <AdminDashboard />}
        {selectedRole === 'membre' && <MemberDashboard />}
    </AppPage>);
}

