'use client';
import useUserContext from "@/contexts/userContext/useUserContext";
import ToolLine from "./ToolLine";
import styles from "@/styles/components/application/sections/toolTable.module.css";

export type ToolTableProps = {
    guildName: string;
}

export default function ToolTable(props: ToolTableProps) {
    const tools = [
        {
            id: '1111111111',
            name: "Outil 1", 
            coef: 1.5,
            is_active: true,
            version: 1
        },
        {
            id: '2222222222',
            name: "Outil 2",
            coef: 2.0,
            is_active: false,
            version: 2
        },
        {
            id: '3333333333',
            name: "Outil 3",
            coef: 0.5,
            is_active: true,
            version: 1
        },
        {
            id: '4444444444',
            name: "Outil 4",
            coef: 3.0,
            is_active: false,
            version: 3
        },
        {
            id: '5555555555',
            name: "Outil 5",
            coef: 1.0,
            is_active: true,
            version: 2
        },
        {
            id: '6666666666',
            name: "Outil 6",
            coef: 2.5,
            is_active: false,
            version: 1
        },
        {
            id: '7777777777',
            name: "Outil 7",
            coef: 0.75,
            is_active: true,
            version: 3
        },
        {
            id: '8888888888',
            name: "Outil 8",
            coef: 1.25,
            is_active: false,
            version: 2
        },
        {
            id: '9999999999',
            name: "Outil 9",
            coef: 1.75,
            is_active: true,
            version: 1
        }
    ]

    return (<section id={styles.toolTable}>
        <div id={styles.indexLine}>
            <p>Nom de l'outil</p>
            <p>Coefficient</p>
            <p>Statut</p>
            <p>Version actuelle</p>
        </div>
        {tools.map((tool) => <ToolLine key={tool.id} tool={tool} />)}
    </section>)
}