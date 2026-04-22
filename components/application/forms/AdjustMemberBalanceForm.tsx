import { PublicMember } from "@/modules/member/member.types";
import { useState } from "react";
import AppInput from "../ui/inputs/AppInput";
import AppBtn from "../ui/buttons/AppBtn";
import styles from "@/styles/components/application/sections/membersTable.module.css";

export type AdjustMemberBalanceFormProps = {
    members: PublicMember[];
    onSuccess: () => void;
}

export default function AdjustMemberBalanceForm(props: AdjustMemberBalanceFormProps) {
    const [selectedMember, setSelectedMember] = useState<string>("");
    const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);

    return (<form id={styles.form} >
        <label htmlFor="memberSelect">
            choisir le membre :
            <select
                id="memberSelect"
                value={selectedMember}
                onChange={(event) => setSelectedMember(event.target.value)}
            >
                <option value="" disabled>Sélectionnez un membre</option>
                {props.members.map((member) => (
                    <option key={member.id} value={member.id}>
                        {member.lastname} {member.firstname}
                    </option>
                ))}
            </select>
        </label>
        {selectedMember && (<div className={styles.adjustBalanceContainer}>
            <p>
                son solde actuel : {(props.members.find(m => m.id === selectedMember)?.points_balance || 0).toFixed(2)}⋈
            </p>
            <AppInput
                type="number"
                value={adjustmentAmount.toString()} 
                label={"Montant de l'ajustement souhaité (en ⋈) :"} 
                onChange={function (newValue: string): void {
                    setAdjustmentAmount(Number(newValue));
                }}            
            />
            <p>
                solde après ajustement : {((props.members.find(m => m.id === selectedMember)?.points_balance || 0) + adjustmentAmount).toFixed(2)}⋈
            </p>
            <AppBtn
                label="Valider l'ajustement"
                color="dark"
                onClick={() => {}}
            />
        </div>)}
    </form>)
}