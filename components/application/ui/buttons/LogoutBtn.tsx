'use client';
import Image from 'next/image';
import styles from "@/styles/components/application/ui/buttons/authBtn.module.css";
import useUserContext from "@/contexts/userContext/useUserContext";
import { useRouter } from 'next/navigation';

/**
 * @description bouton de déconnexion
 */
export default function LogoutBtn() {
    const { setUser } = useUserContext();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/session/logout", {
            method: "POST",
        });
        setUser(null);
        router.push("/");
    }
    return (<button 
        id={styles.authBtn}
        onClick={() => handleLogout()}
    >
        <Image src={"/images/icons/logout-white-on-dark.svg"} alt={"logout icon"} width={40} height={40} />
        <p>Se déconnecter</p>
    </button>);
}

