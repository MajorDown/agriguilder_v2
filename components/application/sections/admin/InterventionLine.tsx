'use client';

import { PublicIntervention } from "@/modules/intervention/intervention.types";
import styles from "@/styles/components/application/sections/interventionTable.module.css";
import Image from "next/image";
import useModal from "@/contexts/modalContext/useModal";
import InterventionDetailsModal from "@/components/application/sections/member/InterventionDetailsModal";

export type InterventionLineProps = {
    intervention: PublicIntervention;
    actualUserEmail?: string;
    onCreateContestation: () => void;

};

export default function InterventionLine(props: InterventionLineProps) {
    const { openModal } = useModal();

    const calculateInterventionValue = (intervention: PublicIntervention): string => {
        return intervention.tools
            .reduce((total, tool) => {
                return total + (tool.coef * intervention.duration);
            }, 0)
            .toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
    };

    const handleOpenDetails = () => {
        openModal({
            title: "Détails de l’intervention",
            size: "large",
            content: (
                <InterventionDetailsModal
                    intervention={props.intervention}
                    onCreate={props.onCreateContestation}
                />
            ),
        });
    };

    return (
        <div className={styles.interventionLine}>
            <div className={styles.dates}>
                <p>{new Date(props.intervention.day).toLocaleDateString("fr-FR")}</p>
                <p>{new Date(props.intervention.created_at).toLocaleDateString("fr-FR")}</p>
            </div>

            <div className={styles.worker}>
                {props.actualUserEmail === props.intervention.worker.email ? (
                    <p>Vous</p>
                ) : (
                    <>
                        {props.intervention.worker.society && <p>{props.intervention.worker.society}</p>}
                        <p>{props.intervention.worker.firstname} {props.intervention.worker.lastname}</p>
                    </>
                )}
            </div>

            <div className={styles.payer}>
                {props.actualUserEmail === props.intervention.payer.email ? (
                    <p>Vous</p>
                ) : (
                    <>
                        {props.intervention.payer.society && <p>{props.intervention.payer.society}</p>}
                        <p>{props.intervention.payer.firstname} {props.intervention.payer.lastname}</p>
                    </>
                )}
            </div>
            {/* si l'utilisateur actuel est le payeur, afficher la valeur en rouge */}
            {props.actualUserEmail === props.intervention.payer.email ? (
                <span className={styles.valueRed}>{calculateInterventionValue(props.intervention)}⋈</span>
            ) : (
                <span className={styles.value}>{calculateInterventionValue(props.intervention)}⋈</span>
            )}

            <p className={styles.status}>{props.intervention.status}</p>

            <button
                type="button"
                className={styles.detailsButton}
                onClick={handleOpenDetails}
            >
                <Image
                    src="/images/icons/show-dark-on-green.svg"
                    alt="détails"
                    width={30}
                    height={30}
                />
            </button>
        </div>
    );
}