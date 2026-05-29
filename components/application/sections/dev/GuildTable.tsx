'use client';
import useUserContext from "@/contexts/userContext/useUserContext";
import Styles from "@/styles/components/application/pages/dev.module.css";

export default function GuildTable() {
    const { user } = useUserContext();

    return (<section>
        <div id={Styles.tableHeader}>
            <p>nom de la guilde</p>
            <p>localisation</p>
            <p>date de création</p>
            <p>bénéficiaire</p>
            <p>valeure</p>
            <p>statut</p>
        </div>
    </section>)
}