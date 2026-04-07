'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "@/styles/components/application/sections/toolTable.module.css";
import { PublicTool } from "@/modules/tool/tool.types";
import useDeleteTool from "@/hooks/tools/useDeleteTool";
import useModal from "@/contexts/modalContext/useModal";
import AppBtn from "@/components/application/ui/buttons/AppBtn";

export type ToolLineProps = {
    tool: PublicTool;
    guildName: string;
    onDeleteSuccess: () => void | Promise<void>;
};

export default function ToolLine(props: ToolLineProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { openModal, closeModal } = useModal();

    const {
        deleteTool,
        isSubmitting,
        errorMessage,
    } = useDeleteTool({
        guildName: props.guildName,
        onSuccess: async () => {
            await props.onDeleteSuccess();
            closeModal();
        },
    });

    const handleDeleteClick = () => {
        openModal({
            title: "Supprimer l'outil",
            size: "small",
            content: (
                <div id={styles.deleteToolModal}>
                    <p>
                        Voulez-vous vraiment supprimer l'outil
                        {" "}
                        <strong>{props.tool.name}</strong>
                        {" "}?
                    </p>
                    {errorMessage && (
                        <p className={styles.formErrorMessage}>{errorMessage}</p>
                    )}
                    <div>
                        <AppBtn
                            color="dark"
                            label={isSubmitting ? "Suppression..." : "Confirmer"}
                            onClick={async () => {
                                await deleteTool({ id: props.tool.id });
                            }}
                        />
                    </div>
                </div>
            ),
        });
    };

    return (
        <div className={styles.toolLine}>
            {!isEditing && (
                <button type="button" onClick={() => setIsEditing(true)}>
                    <Image
                        src="/images/icons/edit-dark-on-green.svg"
                        alt="edit"
                        width={30}
                        height={30}
                    />
                </button>
            )}

            {isEditing && (
                <button type="button" onClick={() => setIsEditing(false)}>
                    <Image
                        src="/images/icons/check-dark-on-green.svg"
                        alt="confirm"
                        width={30}
                        height={30}
                    />
                </button>
            )}

            <p>{props.tool.name}</p>
            <p>{props.tool.coef}</p>
            <p>{props.tool.is_active ? "Actif" : "Inactif"}</p>
            <p>v{props.tool.version}</p>

            <button type="button" onClick={handleDeleteClick}>
                <Image
                    src="/images/icons/trash-dark-on-green.svg"
                    alt="delete"
                    width={30}
                    height={30}
                />
            </button>
        </div>
    );
}