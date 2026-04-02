'use client';
import styles from "@/styles/components/application/ui/inputs/roleSelect.module.css";
import useUserContext from "@/contexts/userContext/useUserContext";
import { GuildRole } from "@/contexts/userContext/userContext.types";

export type DataForRoleSelect = {
    label: GuildRole;
    value: GuildRole;
}[];

type RoleSelectProps = {
    roles: DataForRoleSelect;
}

/**
 * @description composant select pour choisir le rôle de l'utilisateur
 * @param props.roles : liste des rôles de l'utilisateur
 */
export default function RoleSelect(props: RoleSelectProps) {
    const { selectedRole, setSelectedRole } = useUserContext();

    return (<select 
        name="roleSelect" 
        id={styles.roleSelect} 
        value={selectedRole ?? ""} 
        onChange={(e) => setSelectedRole(e.target.value as GuildRole)}
    >
        <option value="" disabled>Choisissez un rôle</option>
        {props.roles.map((role, index) => (
            <option key={index} value={role.value}>{role.label}</option>
        ))}
    </select>)
}