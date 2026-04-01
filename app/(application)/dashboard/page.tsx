import AppPage from "@/components/application/ui/AppPage";

export default function DashboardPage() {
    return (<AppPage title="Tableau de bord" requiredRole={['membre', 'admin', 'employé']}>
        <section>
        <p>Bienvenue sur votre tableau de bord.</p>
        <p>Vous pouvez gérer vos informations et accéder aux fonctionnalités disponibles en fonction de votre rôle.</p>
        <p>Assurez-vous de respecter les règles et les directives de votre organisation lors de l'utilisation de cette plateforme.</p>
        </section>
    </AppPage>);
}

