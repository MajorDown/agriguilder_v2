'use client';

import { useMemo, useState } from "react";
import useGuildTable from "@/hooks/guild/useGuildTable";
import Styles from "@/styles/pages/dev.module.css";
import AppSpinner from "@/components/application/ui/AppSpinner";
import AppInput from "../../ui/inputs/AppInput";
import GuildLine from "./GuildLine";

export default function GuildTable() {
    const [search, setSearch] = useState<string>("");

    const {
        guilds,
        isLoading,
        errorMessage,
    } = useGuildTable();

    const filteredGuilds = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return guilds;
        }

        return guilds.filter((guild) =>
            guild.name.toLowerCase().includes(normalizedSearch)
        );
    }, [guilds, search]);

    if (isLoading) {
        return (
            <section>
                <p>Chargement des guildes...</p>
                <AppSpinner />
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section>
                <p>{errorMessage}</p>
            </section>
        );
    }

    if (guilds.length === 0) {
        return (
            <section>
                <p>Aucune guilde trouvée.</p>
            </section>
        );
    }

    return (
        <section>
            <AppInput
                type="text"
                value={search}
                onChange={(value) => setSearch(value)}
                placeholder="Rechercher une guilde..."
                label=""
            />
            <div id={Styles.tableHeader}>
                <p>nom de la guilde</p>
                <p>localisation</p>
                <p>date de création</p>
                <p>membres</p>
                <p>admins</p>
                <p>outils</p>
            </div>

            {filteredGuilds.length === 0 ? (
                <p>Aucune guilde ne correspond à la recherche.</p>
            ) : (
                filteredGuilds.map((guild) => (
                    <GuildLine key={guild.id} guild={guild} />
                ))
            )}
        </section>
    );
}