'use client'
import { PublicGuildWithRules } from "@/modules/guild/guild.types"
import styles from '@/styles/pages/rules.module.css';

export type GuildInformationsProps = {
    guild: PublicGuildWithRules
}

export default function GuildInformations(props: GuildInformationsProps) {
    return (<section>
        <h3>paramètrages</h3>
        <p>
            l'ensemble des paramètres de la guilde sont définis lors de sa création. Ils peuvent être modifiés 
            au moment de la réinitialisation (remise à zéro des compteurs)
        </p>
        <div className={styles.line}>
            <div className={styles.column}>
                <p>Nom de la guilde :</p> 
                <p>{props.guild.name}</p>
            </div>
            <div className={styles.column}>
                <p>Domiciliation :</p>
                <p>{props.guild.city}, {props.guild.department}</p>
            </div>
            <div className={styles.column}>
                <p>Valeur en Guilders (⋈) de l'heure humaine :</p>
                <p> {props.guild.human_hour_point_value}⋈</p>
            </div>
        </div>
        <div className={styles.line}>
            <div className={styles.column}>
                <p>Délai maximal de déclaration :</p>
                <p>{props.guild.max_declaration_delay} jours après intervention</p>

            </div>
            <div>
                <p>Délai maximal de contestation :</p>
                <p> {props.guild.max_contestation_delay} jours après déclaration</p>
            </div>
        </div>
        <div className={styles.line}>
            <div className={styles.column}>
                <p>Délai maximal de validation : {props.guild.max_validation_delay} jours après déclaration</p>
                {props.guild.max_validation_delay === 0 && <p>(La validation se fera automatiquement après la déclaration)</p>}
            </div>
        </div>
    </section>)
}