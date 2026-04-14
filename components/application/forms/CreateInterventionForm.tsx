import { useState } from "react";
import MemberSelect from "@/components/application/ui/inputs/MemberSelect";
import AppDateInput from "@/components/application/ui/inputs/AppDateInput";
import AppDurationInput from "@/components/application/ui/inputs/AppDurationInput";
import styles from "@/styles/pages/declarer.module.css";
import useUserContext from "@/contexts/userContext/useUserContext";
import ToolSelector from "../ui/inputs/ToolSelector";

export default function CreateInterventionForm() {
    const { selectedGuild } = useUserContext();
    const [ selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [ selectedDate, setSelectedDate ] = useState<string>("");
    const [ selectedDuration, setSelectedDuration ] = useState<number>(0);

    return (<section>
        <form id={styles.form}>
            <p>Utilisez ce formulaire pour déclarer une intervention auprès de la guilde {selectedGuild}</p>
            {/* Formulaire de création d'intervention
            1. choisir le bénéficiaire
            2. choisir la date
            3. choisir la durée
            4. choisir les outils utilisés
            5. description verbale de l'intervention
            */}
            <MemberSelect 
                selectedMemberId={selectedMemberId} 
                onChange={setSelectedMemberId} 
            />
            <AppDateInput 
                value={selectedDate} 
                onChange={setSelectedDate} 
                maxDaysPast={7} 
                label="Date de l'intervention :" 
            />
            <AppDurationInput
                value={selectedDuration}
                onChange={setSelectedDuration}
                label="Durée de l'intervention :"
            />
            <ToolSelector />
        </form>
    </section>)
}