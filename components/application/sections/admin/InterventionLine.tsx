import { PublicIntervention } from "@/modules/intervention/intervention.types";
import styles from "@/styles/components/application/sections/interventionTable.module.css";
import Image from "next/image";

export type InterventionLineProps = {
    intervention: PublicIntervention
}


export default function InterventionLine(props: InterventionLineProps) {
    const calculateInterventionValue = (intervention: PublicIntervention): string => {
        return intervention.tools.reduce((total, tool) => {
            return total + (tool.coef * intervention.duration);
        }, 0).toFixed(2);
    }

    return (<div className={styles.interventionLine}>
        <div>
            <p>{props.intervention.day.toLocaleDateString()}</p>
            <p>{props.intervention.created_at.toLocaleDateString()}</p>
        </div>
        <div>
            {props.intervention.worker.society && <p>{props.intervention.worker.society}</p>}
            <p>{props.intervention.worker.firstname} {props.intervention.worker.lastname}</p>
        </div>
        <div>
            {props.intervention.payer.society && <p>{props.intervention.payer.society}</p>}
            <p>{props.intervention.payer.firstname} {props.intervention.payer.lastname}</p>
        </div>
        <p>{calculateInterventionValue(props.intervention)}</p>
        <p>{props.intervention.status}</p>
        <button className={styles.detailsButton}>
            <Image src="/images/icons/show-dark-on-green.svg" alt="détails" width={30} height={30} />
        </button>
    </div>)
}