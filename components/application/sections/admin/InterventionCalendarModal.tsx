'use client';

import { PublicIntervention } from '@/modules/intervention/intervention.types';
import styles from '@/styles/components/application/ui/appCalendar.module.css';
import InterventionDetailsModal from '../member/InterventionDetailsModal';

export type InterventionCalendarModalProps = {
    dateLabel: string;
    interventions: PublicIntervention[];
};

export default function InterventionCalendarModal(props: InterventionCalendarModalProps) {
    const { dateLabel, interventions } = props;

    if (interventions.length === 0) {
        return (
            <section className={styles.container}>
                <p>Aucune intervention pour le {dateLabel}.</p>
            </section>
        );
    }

    return (
        <div>
            {interventions.map((intervention) => (
                <InterventionDetailsModal 
                    key={intervention.id}
                    intervention={intervention} 
                    onCreate={() => {}}
                />
            ))}
        </div>
    );
}