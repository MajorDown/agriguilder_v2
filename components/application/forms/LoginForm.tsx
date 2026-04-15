'use client';
import Link from "next/link";
import AppBtn from "../ui/buttons/AppBtn";
import AppInput from "../ui/inputs/AppInput";
import { useLoginForm } from "@/hooks/forms/useLoginForm";
import styles from "@/styles/components/application/forms/loginForm.module.css";

export default function LoginForm() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleSubmit,
    } = useLoginForm();

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <p>Veuillez renseigner vos identifiants</p>
            <AppInput
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="roro@mail.com"
            />
            <AppInput
                label="Mot de passe"
                type="password"
                value={password}
                onChange={setPassword}
                showTogglePassword
            />
            {error && <p className={"error"}>{error}</p>}
            <AppBtn
                label={isLoading ? "Connexion..." : "Se connecter"}
                type="submit"
                color="light"
            />
            <Link href="/forgot-password">Mot de passe oublié ?</Link>
        </form>
    );
}