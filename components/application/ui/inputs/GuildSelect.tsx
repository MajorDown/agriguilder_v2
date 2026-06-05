'use client';
import styles from "@/styles/components/application/ui/inputs/guildSelect.module.css";
import useUserContext from "@/contexts/userContext/useUserContext";
import {useRouter} from "next/navigation"

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
    const router = useRouter();
    const { selectedGuild, setSelectedGuild, setSelectedRole, user } = useUserContext();

    const handleGuildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextGuild = e.target.value;
        const nextRole = user?.relations.find((relation) => relation.guildName === nextGuild)?.role ?? null;

        setSelectedGuild(nextGuild);
        setSelectedRole(nextRole);
        router.push(`/dashboard`);
    }

    return (<select 
        name="guildSelect" 
        id={styles.guildSelect} 
        value={selectedGuild ?? ""} 
        onChange={(event) => handleGuildChange(event)}
    >
        <option value="" disabled>Choisissez une guilde</option>
        {props.guilds.map((guild, index) => (
            <option key={index} value={guild.value}>{guild.label}</option>
        ))}
    </select>)
}
