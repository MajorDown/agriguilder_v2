import Image from 'next/image';
import styles from "@/styles/components/application/ui/buttons/authBtn.module.css";

/**
 * @description bouton de déconnexion
 */
export default function LogoutBtn() {
    return (<button id={styles.authBtn}>
        <Image src={"/images/icons/logout-white-on-dark.svg"} alt={"logout icon"} width={40} height={40} />
        <p>Se déconnecter</p>
    </button>);
}

