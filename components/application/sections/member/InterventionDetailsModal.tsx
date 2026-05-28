'use client';

import { PublicIntervention } from "@/modules/intervention/intervention.types";
import styles from "@/styles/components/application/sections/interventionTable.module.css";
import AppBtn from "../../ui/buttons/AppBtn";
import Image from "next/image";
import { useState } from "react";
import CreateContestationForm from "@/components/application/sections/member/CreateContestationForm";
import useUserContext from "@/contexts/userContext/useUserContext";

export type InterventionDetailsModalProps = {
    intervention: PublicIntervention;
    onCreate: () => void;
};

export default function InterventionDetailsModal(props: InterventionDetailsModalProps) {
    const { intervention } = props;
    const { selectedRole } = useUserContext();
    const [wantToContest, setWantToContest] = useState(false);

    const getToolValue = (tool: PublicIntervention["tools"][number]) => {
        if (tool.unit === "HECTARE") {
            return tool.coef * (intervention.surface ?? 0);
        }

        return tool.coef * (intervention.duration ?? 0);
    };

    const interventionValue = intervention.tools.reduce((total, tool) => {
        return total + getToolValue(tool);
    }, 0);

    return (
        <div className={styles.modalContainer}>
            <div className={styles.dateSection}>
                <h4>Dates :</h4>
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

            <div className={styles.descriptionSection}>
                <h4>Description :</h4>
                <div className={styles.line}>
                    <p>"{intervention.description || "Aucune description fournie."}"</p>
                </div>
            </div>

            <div className={styles.durationSection}>
                <h4>Durée de l'intervention</h4>
                <div className={styles.horizon}></div>
                <p>
                    {(intervention.duration ?? 0).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })} h
                </p>
            </div>

            {intervention.surface !== null && intervention.surface !== undefined && (
                <div className={styles.durationSection}>
                    <h4>Surface concernée</h4>
                    <div className={styles.horizon}></div>
                    <p>
                        {intervention.surface.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })} ha
                    </p>
                </div>
            )}

            <div className={styles.toolsSection}>
                <h4>Outils utilisés :</h4>
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
                            const toolValue = getToolValue(tool);

                            return (
                                <li key={tool.id} className={styles.toolLine}>
                                    <p>{tool.name}</p>
                                    <p>{tool.version}</p>
                                    <p>
                                        {tool.coef.toLocaleString("fr-FR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}({tool.unit === "HECTARE" ? "/ha" : "/h"})
                                    </p>
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
                <p>
                    {intervention.status === "VALIDEE" && "Validé"}
                    {intervention.status === "DECLARE" && "En attente de validation"}
                    {intervention.status === "CONTESTEE" && "Contesté"}
                    {intervention.status === "ANNULEE" && "Annulé"}
                </p>
            </div>

            {intervention.isContestable && intervention.status === "VALIDEE" && selectedRole === "membre" && (
                <p>vous constatez une erreur ?</p>
            )}

            {!wantToContest && intervention.isContestable && intervention.status === "VALIDEE" && selectedRole === "membre" && (
                <div className={styles.contestSection}>
                    <Image src="/images/icons/signal-dark-on-green.svg" alt="contester" width={30} height={30} />
                    <AppBtn label="Contester" color="dark" onClick={() => setWantToContest(true)} />
                    <Image src="/images/icons/signal-dark-on-green.svg" alt="contester" width={30} height={30} />
                </div>
            )}

            {wantToContest && selectedRole === "membre" && (
                <CreateContestationForm
                    interventionId={intervention.id}
                    guildName={intervention.guildName}
                    onCreate={() => {
                        props.onCreate();
                        setWantToContest(false);
                    }}
                />
            )}
        </div>
    );
}