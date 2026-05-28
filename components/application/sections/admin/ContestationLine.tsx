'use client';

import { PublicContestation } from "@/modules/contestation/contestation.types";
import styles from "@/styles/components/application/sections/contestationTable.module.css";
import Image from "next/image";

export type ContestationLineProps = {
    contestation: PublicContestation;
    onResolveContestation: () => void;
};

/**
 * @description Composant représentant une ligne de contestation dans ContestationTable.
 * @param {PublicContestation} props.contestation - La contestation à afficher.
 * @param {() => void} props.onResolveContestation - Fonction à appeler lors de la résolution d'une contestation.
 * @returns {JSX.Element} Le composant ContestationLine.
 */
export default function ContestationLine(props: ContestationLineProps) {
    const { contestation } = props;

    return (
        <div className={styles.contestationLine}>
            <div className={styles.dates}>
                <p>{new Date(contestation.created_at).toLocaleDateString("fr-FR")}</p>
                <p>{new Date(contestation.intervention.day).toLocaleDateString("fr-FR")}</p>
            </div>
            <div className={styles.contester}>
                {contestation.contester.society && <p>{contestation.contester.society}</p>}
                <p>{contestation.contester.firstname} {contestation.contester.lastname}</p>
            </div>
            <p>"{contestation.reason}"</p>
            <p className={styles.status}>{contestation.status}</p>
            <button
                type="button"
                className={styles.detailsButton}
                onClick={props.onResolveContestation}
                disabled={contestation.status !== "EN_ATTENTE"}
            >
                <Image
                    src="/images/icons/show-dark-on-green.svg"
                    alt="statuer"
                    width={30}
                    height={30}
                />
            </button>
        </div>
    );
}