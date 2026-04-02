import useUserContext from "@/contexts/userContext/useUserContext"
import styles from "@/styles/components/application/nav/navBar.module.css";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();
    const { user, selectedGuild } = useUserContext();

    const userRoles: { label: string; value: string }[] = user?.relations.filter(
        relation => relation.guildId === selectedGuild
    ).map(relation => ({ label: relation.role, value: relation.role.toLowerCase() })) || [];

    return (<nav id={styles.navBar}>
        <NavLink 
            href={"/interventions"} 
            label={"Interventions"} 
            image={"intervention"} 
            selected={pathname === "/interventions"} 
        />
        <NavLink 
            href={"/soldes"} 
            label={"Soldes"} 
            image={"membre"} 
            selected={pathname === "/soldes"} 
        />
        <NavLink 
            href={"/interventions"} 
            label={"Interventions"} 
            image={"intervention"} 
            selected={pathname === "/interventions"} 
        />
        <NavLink 
            href={"/reglement"} 
            label={"Règlement"} 
            image={"rules"} 
            selected={pathname === "/reglement"} 
        />
    </nav>)
}