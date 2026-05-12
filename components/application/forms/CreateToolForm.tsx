'use client';

import AppBtn from "../ui/buttons/AppBtn";
import AppInput from "../ui/inputs/AppInput";
import useCreateTool, { ToolUnit } from "@/hooks/tools/useCreateTool";
import styles from '@/styles/components/application/forms/createToolForm.module.css';

export type CreateToolFormProps = {
    guildName: string;
    onSuccess?: () => void | Promise<void>;
};

export default function CreateToolForm(props: CreateToolFormProps) {
    const {
        toolName,
        toolCoef,
        toolUnit,
        isSubmitting,
        errorMessage,
        successMessage,
        handleToolNameChange,
        handleToolCoefChange,
        handleToolUnitChange,
        handleSubmit,
    } = useCreateTool({
        guildName: props.guildName,
        onSuccess: props.onSuccess,
    });

    return (
        <form onSubmit={handleSubmit} id={styles.createToolForm}>
            <AppInput
                label="Nom de l'outil"
                name="toolName"
                placeholder="Entrez le nom de l'outil"
                type="text"
                value={toolName}
                onChange={handleToolNameChange}
            />

            <AppInput
                label="Coefficient de l'outil"
                name="toolCoef"
                placeholder="Coefficient de l'outil"
                type="number"
                value={toolCoef}
                onChange={handleToolCoefChange}
            />

            <label htmlFor="toolUnit">
                Unité de calcul
                <select
                    id="toolUnit"
                    name="toolUnit"
                    value={toolUnit}
                    onChange={(event) => {
                        handleToolUnitChange(event.target.value as ToolUnit);
                    }}
                >
                    <option value="HEURE">Heure</option>
                    <option value="ARE">Are</option>
                </select>
            </label>

            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <AppBtn
                label={isSubmitting ? "Création..." : "Créer l'outil"}
                color="dark"
                type="submit"
            />
        </form>
    );
}