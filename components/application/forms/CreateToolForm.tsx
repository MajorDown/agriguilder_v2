'use client';
import AppBtn from "../ui/buttons/AppBtn";
import AppInput from "../ui/inputs/AppInput";
import useCreateTool from "@/hooks/tools/useCreateTool";

export type CreateToolFormProps = {
    guildName: string;
    onSuccess?: () => void | Promise<void>;
};

export default function CreateToolForm(props: CreateToolFormProps) {
    const {
        toolName,
        toolCoef,
        isSubmitting,
        errorMessage,
        successMessage,
        handleToolNameChange,
        handleToolCoefChange,
        handleSubmit,
    } = useCreateTool({
        guildName: props.guildName,
        onSuccess: props.onSuccess,
    });

    return (
        <form onSubmit={handleSubmit}>
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

            {errorMessage && <p>{errorMessage}</p>}
            {successMessage && <p>{successMessage}</p>}

            <AppBtn
                label={isSubmitting ? "Création..." : "Créer l'outil"}
                color="dark"
                type="submit"
            />
        </form>
    );
}