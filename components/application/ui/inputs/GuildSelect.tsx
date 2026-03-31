'use client';
import { useState } from "react";
import styles from "@/styles/components/application/ui/inputs/guildSelect.module.css";

export type DataForGuildSelect = {
    label: string;
    value: string;
}[];

type GuildSelectProps = {
    guilds: DataForGuildSelect;
}

/**
 * @description composant select pour choisir la guilde de l'utilisateur
 * @param props.guilds : liste des guildes de l'utilisateur
 */
export default function GuildSelect(props: GuildSelectProps) {
    const [selectedGuild, setSelectedGuild] = useState<string>("");

    return (<select 
        name="guildSelect" 
        id={styles.guildSelect} 
        value={selectedGuild} 
        onChange={(e) => setSelectedGuild(e.target.value)}
    >
        {props.guilds.map((guild, index) => (
            <option key={index} value={guild.value}>{guild.label}</option>
        ))}
    </select>)
}