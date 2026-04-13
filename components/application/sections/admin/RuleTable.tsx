'use client';

import AppBtn from "@/components/application/ui/buttons/AppBtn";
import RuleLine from "@/components/application/sections/admin/RuleLine";;
import CreateRuleForm from "@/components/application/forms/CreateRuleForm";
import useModal from "@/contexts/modalContext/useModal";
import useUserContext from "@/contexts/userContext/useUserContext";
import { PublicRule } from "@/modules/rule/rule.types";
import styles from "@/styles/pages/rules.module.css";

export type RuleTableProps = {
    guildName: string;
    rules: PublicRule[];
    onRefresh: () => void;
};

export default function RuleTable(props: RuleTableProps) {
    const { selectedRole } = useUserContext();
    const { openModal, closeModal } = useModal();

    const handleOpenCreateModal = () => {
        openModal({
            title: "Créer une nouvelle règle",
            size: "medium",
            content: (
                <CreateRuleForm
                    guildName={props.guildName}
                    onCreate={() => {
                        closeModal();
                        props.onRefresh();
                    }}
                />
            ),
        });
    };

    return (
        <section className={styles.ruleTable}>
            <h3>Règlement intérieur</h3>
            {props.rules.length > 0 ? (
                props.rules.map((rule) => (
                    <RuleLine
                    key={rule.id}
                    rule={rule}
                    guildName={props.guildName}
                    onUpdate={props.onRefresh}
                    />
                ))
            ) : (
                <p>Aucun règlement n'a actuellement été rédigé.</p>
            )}
            {selectedRole === "admin" && (
                <AppBtn
                    onClick={handleOpenCreateModal}
                    label="Créer une nouvelle règle"
                    color="light"
                />
            )}
        </section>
    );
}