import useUserContext from "@/contexts/userContext/useUserContext"
import styles from "@/styles/components/application/nav/navBar.module.css";
import NavLink from "./NavLink";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();
    const { selectedRole } = useUserContext();

    return (<nav id={styles.navBar}>
        <NavLink 
            href={"/dashboard"} 
            label={"Accueil"} 
            image={"options"} 
            selected={pathname === "/dashboard"} 
        />
        {selectedRole === 'admin' && <>        
            <NavLink 
                href={"/outils"} 
                label={"Outils"} 
                image={"outils"} 
                selected={pathname === "/outils"} 
            />                 
            <NavLink 
                href={"/membres"} 
                label={"Membres"} 
                image={"membres"} 
                selected={pathname === "/membres"} 
            />
            <NavLink 
                href={"/interventions"} 
                label={"Interventions"} 
                image={"historique"} 
                selected={pathname === "/interventions"} 
            />
            <NavLink 
                href={"/contestations"} 
                label={"Contestations"} 
                image={"arbitrage"} 
                selected={pathname === "/contestations"} 
            />
            <NavLink 
                href={"/guilde"} 
                label={"Guilde"} 
                image={"rules"} 
                selected={pathname === "/guilde"} 
            />
        </>}
        {selectedRole === 'membre' &&<>        
            <NavLink 
                href={"/declarer"} 
                label={"Déclarer"} 
                image={"intervention"} 
                selected={pathname === "/declarer"} 
            />                 
            <NavLink 
                href={"/historique"} 
                label={"Historique"} 
                image={"historique"} 
                selected={pathname === "/historique"} 
            />
            <NavLink 
                href={"/soldes"} 
                label={"Soldes"} 
                image={"membres"} 
                selected={pathname === "/soldes"} 
            />
            <NavLink 
                href={"/reglement"} 
                label={"Règlement"} 
                image={"rules"} 
                selected={pathname === "/reglement"} 
            />
        </>}
        <NavLink 
            href={"/options"} 
            label={"Options"} 
            image={"options"} 
            selected={pathname === "/options"} 
        />
    </nav>)
}