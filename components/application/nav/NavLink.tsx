import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/components/application/nav/navBar.module.css";

export type NavLinkProps = {
    selected: boolean;
    href: string;
    label: string;
    image: string;
}

export default function NavLink({ href, label, image, selected }: NavLinkProps) {
    return (<Link href={href} className={`${styles.navLink} ${selected ? styles.selected : ""}`}>
        <Image 
            src={selected ? 
                `/images/icons/${image}-dark-on-green.svg` : 
                `/images/icons/${image}-white-on-green.svg` } alt={label}
            width={32} height={32}
        />
        <p>{label}</p>
    </Link>)
}