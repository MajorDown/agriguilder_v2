import { PublicMember } from "@/modules/member/member.types";
import { useMemo, useState } from "react";
import AppInput from "../ui/inputs/AppInput";
import AppBtn from "../ui/buttons/AppBtn";
import styles from "@/styles/components/application/sections/membersTable.module.css";
import { adjustmentReasons, AdjustmentReason } from "@/modules/adjustment/adjustment.types";
import useCreateAdjustment from "@/hooks/adjustments/useCreateAdjustment";

export type CreateAdjustmentFormProps = {
    members: PublicMember[];
    onSuccess: () => void;
};

export default function CreateAdjustmentForm(props: CreateAdjustmentFormProps) {
    const [selectedMember, setSelectedMember] = useState<string>("");
    const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
    const [adjustmentReason, setAdjustmentReason] = useState<AdjustmentReason | "">("");

    const { createAdjustment, isLoading, error } = useCreateAdjustment(props.onSuccess);

    const currentMember = useMemo(
        () => props.members.find((member) => member.id === selectedMember),
        [props.members, selectedMember]
    );

    const currentBalance = currentMember?.points_balance || 0;
    const balanceAfterAdjustment = currentBalance + adjustmentAmount;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedMember) return;
        if (!adjustmentReason) return;

        await createAdjustment({
            memberId: selectedMember,
            amount: adjustmentAmount,
            reason: adjustmentReason,
        });
    }

    return (
        <form id={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="memberSelect">
                Choisir le membre :
                <select
                    id="memberSelect"
                    value={selectedMember}
                    onChange={(event) => setSelectedMember(event.target.value)}
                >
                    <option value="" disabled>
                        Sélectionnez un membre
                    </option>
                    {props.members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.lastname} {member.firstname}
                        </option>
                    ))}
                </select>
            </label>

            {selectedMember && (
                <div className={styles.adjustBalanceContainer}>
                    <p>
                        Son solde actuel : {currentBalance.toFixed(2)}⋈
                    </p>

                    <AppInput
                        type="number"
                        value={adjustmentAmount.toString()}
                        label="Montant de l'ajustement (en ⋈) :"
                        onChange={(newValue: string): void => {
                            setAdjustmentAmount(Number(newValue));
                        }}
                    />

                    <p>
                        Solde après ajustement : {balanceAfterAdjustment.toFixed(2)}⋈
                    </p>

                    <label htmlFor="adjustmentReason">
                        Raison de l'ajustement :
                        <select
                            id="adjustmentReason"
                            value={adjustmentReason}
                            onChange={(event) =>
                                setAdjustmentReason(event.target.value as AdjustmentReason)
                            }
                        >
                            <option value="" disabled>
                                Choisissez une raison
                            </option>
                            {adjustmentReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </label>

                    {error && <p className={styles.error}>{error}</p>}

                    <AppBtn
                        label={isLoading ? "Validation..." : "Valider l'ajustement"}
                        color="dark"
                        type="submit"
                    />
                </div>
            )}
        </form>
    );
}