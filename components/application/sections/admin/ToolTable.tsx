'use client';

import { useMemo, useState } from "react";
import ToolLine from "./ToolLine";
import styles from "@/styles/components/application/sections/toolTable.module.css";
import useToolTable from "@/hooks/tools/useToolTable";
import { PublicTool } from "@/modules/tool/tool.types";
import AppBtn from "../../ui/buttons/AppBtn";

export type ToolTableProps = {
    guildName: string;
};

type ToolSortOption = "alphabetical" | "status";

export default function ToolTable(props: ToolTableProps) {
    const { tools, isLoading, errorMessage } = useToolTable(props.guildName);
    const [sortBy, setSortBy] = useState<ToolSortOption>("alphabetical");

    const sortedTools = useMemo(() => {
        const toolsCopy = [...tools];
        if (sortBy === "alphabetical") {
            return toolsCopy.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        }
        if (sortBy === "status") {
            return toolsCopy.sort((a, b) => {
                if (a.is_active === b.is_active) {
                    return a.name.localeCompare(b.name, "fr");
                }
                return a.is_active ? -1 : 1;
            });
        }

        return toolsCopy;
    }, [tools, sortBy]);

    if (isLoading) {
        return (<section id={styles.toolTable}>
            <p>Chargement des outils...</p>
        </section>);
    }

    if (errorMessage) {
        return (<section id={styles.toolTable}>
            <p>{errorMessage}</p>
        </section>);
    }

    if (tools.length === 0) {
        return (<section id={styles.toolTable}>
            <p>Aucun outil trouvé pour cette guilde.</p>
        </section>);
    }

    return (<section id={styles.toolTable}>
        <div id={styles.toolTableHeader}>
            <label htmlFor="tool-sort">Trier par
                <select
                    id="tool-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as ToolSortOption)}
                    >
                    <option value="alphabetical">Ordre alphabétique</option>
                    <option value="status">Actifs / inactifs</option>
                </select>
            </label>
            <AppBtn onClick={() => { } } color="light" label="Créer un nouvel outil" />
        </div>

        <div id={styles.indexLine}>
            <p>Nom de l&apos;outil</p>
            <p>Coefficient</p>
            <p>Statut</p>
            <p>Version actuelle</p>
        </div>

        {sortedTools.map((tool: PublicTool) => (
            <ToolLine key={tool.id} tool={tool} />
        ))}
    </section>);
}