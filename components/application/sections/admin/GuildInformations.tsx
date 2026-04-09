'use client'
import { PublicGuildWithRules } from "@/modules/guild/guild.types"

export type GuildInformationsProps = {
    guild: PublicGuildWithRules
}

export default function GuildInformations(props: GuildInformationsProps) {
    return (<section>
        <h3>paramètrages</h3>
        <p>Nom de la guilde : {props.guild.name}</p>
        <p>Domiciliation : {props.guild.city}, {props.guild.department}</p>
        <p>Valeur en point de l'heure humaine : {props.guild.human_hour_point_value}pts</p>
        <p>Délai maximal de déclaration : {props.guild.max_declaration_delay} jours après intervention</p>
        <p>Délai maximal de validation : {props.guild.max_validation_delay} jours après déclaration</p>
        {props.guild.max_validation_delay === 0 && <p>(La validation se fera automatiquement après la déclaration)</p>}
        <p>Délai maximal de contestation : {props.guild.max_contestation_delay} jours après déclaration</p>
    </section>)
}