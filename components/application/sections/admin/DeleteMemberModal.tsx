'use client';

import AppBtn from "@/components/application/ui/buttons/AppBtn";
import useModal from "@/contexts/modalContext/useModal";
import useDeleteMember from "@/hooks/members/useDeleteMember";

type ConfirmDeleteMemberModalProps = {
    memberId: string;
    memberFirstName: string;
    guildName: string;
    onDeleted?: () => void | Promise<void>;
};

export default function ConfirmDeleteMemberModal(props: ConfirmDeleteMemberModalProps) {
    const { closeModal } = useModal();

    const {
        isSubmitting,
        errorMessage,
        deleteMember,
        resetMessages,
    } = useDeleteMember({
        guildName: props.guildName,
        onSuccess: async () => {
            await props.onDeleted?.();
            closeModal();
        },
    });

    const handleConfirm = async () => {
        await deleteMember({ memberId: props.memberId });
    };

    const handleCancel = () => {
        resetMessages();
        closeModal();
    };
    return (
        <div>
            <p>En cliquant sur "Supprimer", <strong>{props.memberFirstName}</strong> sera retiré de la guilde.</p>
            <p>
                Cette action supprime uniquement l'entité membre au sein de la guilde,
                pas l'utilisateur lui-même.
            </p>
            {errorMessage && <p>{errorMessage}</p>}
                <AppBtn
                    label={isSubmitting ? "Suppression..." : "Supprimer"}
                    color={'dark'}
                    onClick={handleConfirm}
                />
        </div>
    );
}