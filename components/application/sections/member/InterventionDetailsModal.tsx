'use client';
import { PublicIntervention } from "@/modules/intervention/intervention.types";
import styles from "@/styles/components/application/sections/interventionTable.module.css";
import AppBtn from "../../ui/buttons/AppBtn";
import Image from "next/image";

export type InterventionDetailsModalProps = {
    intervention: PublicIntervention;
};

export default function InterventionDetailsModal(props: InterventionDetailsModalProps) {
    const { intervention } = props;

    const interventionValue = intervention.tools.reduce((total, tool) => {
        return total + (tool.coef * intervention.duration);
    }, 0);

    return (
        <div className={styles.modalContainer}>
            <div className={styles.dateSection}>
                <h4>Dates</h4>
                <div className={styles.line}>
                    <div className={styles.column}>
                        <p className={styles.label}>Jour de l’intervention</p>
                        <p>{new Date(intervention.day).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className={styles.column}>
                        <p className={styles.label}>Date de déclaration</p>
                        <p>{new Date(intervention.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                </div>
            </div>
            <div className={styles.membersSection}>
                <h4>Membre concernés :</h4>
                <div className={styles.line}>
                    <div className={styles.column}>
                        <p>déclarant :</p>
                        <p>
                            {intervention.worker.society && `${intervention.worker.society}`}
                            {intervention.worker.society && intervention.worker.firstname && " - "}
                            {intervention.worker.firstname} {intervention.worker.lastname}
                        </p>
                    </div>
                    <div className={styles.column}>
                        <p>bénéficiaire :</p>
                        <p>
                            {intervention.payer.society && `${intervention.payer.society}`}
                            {intervention.payer.society && intervention.payer.firstname && " - "}
                            {intervention.payer.firstname} {intervention.payer.lastname}
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.durationSection}>
                <h4>Durée de l'intervention</h4>
                <div className={styles.horizon}></div>
                <p>{intervention.duration.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })} h</p>
            </div>
            <div className={styles.toolsSection}>
                <h4>Outils utilisés</h4>
                {intervention.tools.length === 0 ? (
                    <p>Aucun outil renseigné.</p>
                ) : (
                    <ul>
                        <li className={styles.toolLineHeader}>
                            <p>nom</p>
                            <p>version</p>
                            <p>Coefficient</p>
                            <p>Valeur</p>
                        </li>
                        {intervention.tools.map((tool) => {
                            const toolValue = tool.coef * intervention.duration;
                            return (
                                <li key={tool.id} className={styles.toolLine}>
                                    <p>{tool.name}</p>
                                    <div className={styles.horizon}></div>
                                    <p>{tool.version}</p>
                                    <div className={styles.horizon}></div>
                                    <p>
                                        {tool.coef.toLocaleString("fr-FR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                    <div className={styles.horizon}></div>
                                    <p>
                                        {toolValue.toLocaleString("fr-FR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })} ⋈
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            <div className={styles.valueSection}>
                <h4>Valeur totale</h4>
                <div className={styles.horizon}></div>
                <p>
                    {interventionValue.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })} ⋈
                </p>
            </div>
            <div className={styles.statusSection}>
                <h4>Statut actuel</h4>
                <div className={styles.horizon}></div>
                <p>{intervention.status}</p>
            </div>
            <p>vous constatez une erreur ?</p>
            <div className={styles.contestSection}>
                <Image src={"/images/icons/signal-dark-on-green.svg"} alt={"contester"} width={30} height={30} />
                <AppBtn label={"Contester"} color={"dark"} />
                <Image src={"/images/icons/signal-dark-on-green.svg"} alt={"contester"} width={30} height={30} />
            </div>
        </div>
    );
}

