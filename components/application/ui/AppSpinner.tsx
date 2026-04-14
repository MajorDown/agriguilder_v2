import Image from "next/image";
import styles from "@/styles/components/application/ui/appSpinner.module.css";

export default function AppSpinner() {
    return (<Image 
        src="/images/icons/loadspinner.png" 
        alt="Loading..." 
        className={styles.appSpinner}
        width={50} 
        height={50}
    />)
}