'use client';

import Image from "next/image";
import styles from "@/styles/components/application/sections/toolTable.module.css";
import { PublicTool } from "@/modules/tool/tool.types";
import useDeleteTool from "@/hooks/tools/useDeleteTool";
import useUpdateTool from "@/hooks/tools/useUpdateTool";
import useModal from "@/contexts/modalContext/useModal";
import AppBtn from "@/components/application/ui/buttons/AppBtn";
import AppInput from "../../ui/inputs/AppInput";
import ToolSwitch from "./ToolSwitch";

export type ToolUnit = "HEURE" | "ARE";

export type ToolLineProps = {
    tool: PublicTool;
    guildName: string;
    onToolChanged: () => void | Promise<void>;
};

/**
 * @description Ligne représentant un Tool dans ToolTable
 */
export default function ToolLine(props: ToolLineProps) {
    console.log('tool.unit :', props.tool.unit);
    const { openModal, closeModal } = useModal();

    const {
        deleteTool,
        isSubmitting: isDeleting,
        errorMessage: deleteErrorMessage,
    } = useDeleteTool({
        guildName: props.guildName,
        onSuccess: async () => {
            await props.onToolChanged();
            closeModal();
        },
    });

    const {
        isEditing,
        name,
        coef,
        unit,
        isSubmitting: isUpdating,
        errorMessage: updateErrorMessage,
        startEditing,
        cancelEditing,
        handleNameChange,
        handleCoefChange,
        handleUnitChange,
        submitUpdate,
    } = useUpdateTool({
        tool: props.tool,
        guildName: props.guildName,
        onSuccess: props.onToolChanged,
    });

    const handleDeleteClick = () => {
        openModal({
            title: "Supprimer l'outil",
            size: "small",
            content: (
                <div id={styles.deleteToolModal}>
                    <p>
                        Voulez-vous vraiment supprimer l'outil{" "}
                        <strong>{props.tool.name}</strong> ?
                    </p>

                    {deleteErrorMessage && (
                        <p className={styles.formErrorMessage}>
                            {deleteErrorMessage}
                        </p>
                    )}

                    <div>
                        <AppBtn
                            color="dark"
                            label={isDeleting ? "Suppression..." : "Confirmer"}
                            onClick={async () => {
                                await deleteTool({ id: props.tool.id });
                            }}
                        />
                    </div>
                </div>
            ),
        });
    };

    const handleEditClick = async () => {
        if (!isEditing) {
            startEditing();
            return;
        }

        await submitUpdate();
    };

    return (
        <div className={styles.toolLine}>
            {!isEditing && (
                <button type="button" onClick={handleEditClick}>
                    <Image
                        src="/images/icons/edit-dark-on-green.svg"
                        alt="edit"
                        width={30}
                        height={30}
                    />
                </button>
            )}

            {isEditing && (
                <button type="button" onClick={handleEditClick}>
                    <Image
                        src="/images/icons/check-dark-on-green.svg"
                        alt="confirm"
                        width={30}
                        height={30}
                    />
                </button>
            )}

            {isEditing ? (
                <AppInput
                    value={name}
                    onChange={handleNameChange}
                    label=""
                    name="toolName"
                    type="text"
                />
            ) : (
                <p>{props.tool.name}</p>
            )}

            {isEditing ? (
                <AppInput
                    value={coef}
                    onChange={handleCoefChange}
                    label=""
                    name="toolCoef"
                    type="number"
                />
            ) : (
                <p>
                    {props.tool.coef}{` (/${formatToolUnit(props.tool.unit)})`}
                </p>
            )}

            {isEditing && (
                <label htmlFor={`tool-unit-${props.tool.id}`}>
                    <select
                        id={`tool-unit-${props.tool.id}`}
                        name="toolUnit"
                        value={unit}
                        onChange={(event) => {
                            handleUnitChange(event.target.value as ToolUnit);
                        }}
                    >
                        <option value="HEURE">/Heure</option>
                        <option value="ARE">/Are</option>
                    </select>
                </label>
            )}

            <ToolSwitch
                toolId={props.tool.id}
                guildName={props.guildName}
                initialIsActive={props.tool.is_active}
            />

            <p>v{props.tool.version}</p>

            {isEditing ? (
                <button type="button" onClick={cancelEditing}>
                    Annuler
                </button>
            ) : (
                <button type="button" onClick={handleDeleteClick}>
                    <Image
                        src="/images/icons/trash-dark-on-green.svg"
                        alt="delete"
                        width={30}
                        height={30}
                    />
                </button>
            )}

            {updateErrorMessage && (
                <p className={styles.formErrorMessage}>{updateErrorMessage}</p>
            )}

            {isUpdating && <p>Enregistrement...</p>}
        </div>
    );
}

function formatToolUnit(unit: string | null | undefined): string {
    if (unit === "ARE") {
        return "are";
    }

    return "heure";
}