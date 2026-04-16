import InterventionLine from "@/components/application/sections/admin/InterventionLine";
import { PublicIntervention } from "@/modules/intervention/intervention.types";
import styles from "@/styles/components/application/sections/interventionTable.module.css";

const interventionsList: PublicIntervention[] = [
    {
        id: '1111111111',
        guild_id: '3333333333',
        worker_id: '1111111111',
        payer_id: '2222222222',
        day: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        duration: 5,
        description: null,
        status: 'VALIDEE',
        guildName: 'Your Guild Name',
        worker: {
            id: '1111111111',
            firstname: 'Jean',
            lastname: 'Dupont',
            email: 'jeandupont@mail.fr',
            phone: '0600000000',
            created_at: new Date(),
            points_balance: 0,
            society: 'GAEC Dupont'
        },
        payer: {
            id: '2222222222',
            firstname: 'Paul',
            lastname: 'Durand',
            email: 'pauldurand@mail.fr',
            phone: '0600000001',
            created_at: new Date(),
            points_balance: 0,
            society: 'EARL Durand'
        },
        tools: [
            {
                id: '4444444444',
                name: 'Tracteur',
                coef: 1,
                version: 1,
                is_active: true,
            },
            {
                id: '5555555555',
                name: 'Charrue',
                coef: 0.5,
                version: 1,
                is_active: true,
            }
        ]
    }
]

export default function InterventionTable() {
    return (<section>
        <div id={styles.tableHeader}>
            <p>date de l'intervention</p>
            <p>date de déclaration</p>
            <p>intervenant</p>
            <p>bénéficiaire</p>
            <p>valeur de l'intervention</p>
            <p>statut</p>
        </div>
        {interventionsList.map((intervention) => (
            <InterventionLine key={intervention.id} intervention={intervention} />
        ))}
    </section>)
}