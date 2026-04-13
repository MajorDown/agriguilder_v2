import Image from "next/image";
import { PublicRule } from "@/modules/rule/rule.types";
import useUserContext from "@/contexts/userContext/useUserContext";
import useUpdateRule from "@/hooks/rules/useUpdateRule";
import useDeleteRule from "@/hooks/rules/useDeleteRule";
import styles from "@/styles/pages/rules.module.css";

export type RuleLineProps = {
    rule: PublicRule;
    guildName: string;
    onUpdate?: () => void;
};

export default function RuleLine(props: RuleLineProps) {
    const { selectedRole } = useUserContext();

    const {
        isEditing,
        content,
        isLoading: isUpdating,
        errorMessage: updateErrorMessage,
        setContent,
        startEditing,
        cancelEditing,
        submitUpdate,
    } = useUpdateRule({
        rule: props.rule,
        guildName: props.guildName,
        onUpdate: props.onUpdate,
    });

    const {
        isLoading: isDeleting,
        errorMessage: deleteErrorMessage,
        submitDelete,
    } = useDeleteRule({
        rule: props.rule,
        guildName: props.guildName,
        onDelete: props.onUpdate,
    });

    const isLoading = isUpdating || isDeleting;
    const errorMessage = updateErrorMessage || deleteErrorMessage;

    const handleEditRule = async () => {
        await submitUpdate();
    };

    const handleCancelEdition = () => {
        cancelEditing();
    };

    const handleDeleteRule = async () => {
        await submitDelete();
    };

    return (
        <div className={styles.ruleLine}>
            {selectedRole === "admin" && (
                <>
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleEditRule}
                                disabled={isLoading}
                            >
                                <Image
                                    src="/images/icons/check-dark-on-green.svg"
                                    alt="valider"
                                    width={24}
                                    height={24}
                                />
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdition}
                                disabled={isLoading}
                            >
                                annuler
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={startEditing}
                            disabled={isLoading}
                        >
                            <Image
                                src="/images/icons/edit-dark-on-green.svg"
                                alt="modifier"
                                width={24}
                                height={24}
                            />
                        </button>
                    )}
                </>
            )}

            {isEditing ? (
                <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    disabled={isLoading}
                />
            ) : (
                <p>{props.rule.content}</p>
            )}

            {selectedRole === "admin" && (
                <button
                    type="button"
                    onClick={handleDeleteRule}
                    disabled={isLoading}
                >
                    <Image
                        src="/images/icons/trash-dark-on-green.svg"
                        alt="supprimer"
                        width={24}
                        height={24}
                    />
                </button>
            )}

            {errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
            )}
        </div>
    );
}