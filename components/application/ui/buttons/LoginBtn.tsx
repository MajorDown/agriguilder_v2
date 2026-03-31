import Link from 'next/link';
import Image from 'next/image';
import styles from "@/styles/components/application/ui/buttons/authBtn.module.css";

/**
 * @description lien vers la page login
 */
export default function LoginBtn() {
    return (<Link href={"/login"} id={styles.authBtn}>
        <Image src={"/images/icons/login-white-on-dark.svg"} alt={"login icon"} width={40} height={40} />
        <p>Se connecter</p>
    </Link>);
}

