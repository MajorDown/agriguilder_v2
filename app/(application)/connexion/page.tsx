import LoginForm from "@/components/application/forms/LoginForm";
import AppPage from "@/components/application/ui/AppPage";

export default function ConnexionPage() {
    return (<AppPage title="Connexion" requiredRole={['visiteur']}>
        <LoginForm />
    </AppPage>);
}

