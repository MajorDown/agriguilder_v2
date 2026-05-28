"use client";

import { FormEvent, useState } from "react";
import MemberSelect from "@/components/application/ui/inputs/MemberSelect";
import AppDateInput from "@/components/application/ui/inputs/AppDateInput";
import AppDurationInput from "@/components/application/ui/inputs/AppDurationInput";
import ToolSelector from "../ui/inputs/ToolSelector";
import AppBtn from "../ui/buttons/AppBtn";
import useUserContext from "@/contexts/userContext/useUserContext";
import useGetTools from "@/hooks/tools/useToolTable";
import styles from "@/styles/components/application/sections/contestationTable.module.css";
import AppSurfaceInput from "../ui/inputs/AppSurfaceInput";
import { PublicContestation } from "@/modules/contestation/contestation.types";
import { ContestationStatus } from "@/prisma/generated/prisma/enums";
import useResolveContestation from "@/hooks/contestations/useResolveContestation";

export type ResolveContestationFormProps = {
    contestation: PublicContestation;
    onResolved?: () => void;
};

function formatDateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function ResolveContestationForm(props: ResolveContestationFormProps) {
    const { selectedGuild } = useUserContext();
    const { tools, isLoading: toolsLoading } = useGetTools(selectedGuild ?? "");

    const [selectedMemberId, setSelectedMemberId] = useState<string>(
        props.contestation.intervention.payer.id
    );
    const [selectedDate, setSelectedDate] = useState<string>(
        formatDateToInputValue(new Date(props.contestation.intervention.day))
    );
    const [selectedDuration, setSelectedDuration] = useState<number>(
        props.contestation.intervention.duration ?? 0
    );
    const [selectedSurface, setSelectedSurface] = useState<number>(
        props.contestation.intervention.surface ?? 0
    );
    const [selectedTools, setSelectedTools] = useState<string[]>(
        props.contestation.intervention.tools.map((tool) => tool.id)
    );
    const [description, setDescription] = useState<string>(
        props.contestation.intervention.description ?? ""
    );
    const [status, setStatus] = useState<ContestationStatus>("ACCEPTEE");

    const {
        isLoading,
        errorMessage,
        successMessage,
        resolveContestation,
    } = useResolveContestation();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedGuild) {
            return;
        }

        const success = await resolveContestation({
            contestationId: props.contestation.id,
            guildName: selectedGuild,
            status,
            payerId: selectedMemberId,
            day: selectedDate,
            duration: selectedDuration,
            surface: selectedSurface,
            tools: selectedTools,
            description: description.trim() || null,
        });

        if (success) {
            props.onResolved?.();
        }
    };

    return (
        <section>
            <form id={styles.form} onSubmit={handleSubmit}>
                <p>
                    Contestation de {props.contestation.contester.firstname} {props.contestation.contester.lastname} le {new Date(props.contestation.created_at).toLocaleDateString("fr-FR")} :
                </p>
                <p>&quot;{props.contestation.reason}&quot;</p>
                <MemberSelect
                    selectedMemberId={selectedMemberId}
                    onChange={setSelectedMemberId}
                />

                <AppDateInput
                    value={selectedDate}
                    onChange={setSelectedDate}
                    maxDaysPast={365}
                    label="Date de l'intervention :"
                    disabled={isLoading || status === "REFUSEE"}
                />

                <AppDurationInput
                    value={selectedDuration}
                    onChange={setSelectedDuration}
                    label="Durée de l'intervention :"
                />

                <AppSurfaceInput
                    value={selectedSurface}
                    onChange={setSelectedSurface}
                    label="Surface concernée (/!\ en hectares) :"
                />

                <ToolSelector
                    tools={tools}
                    isLoading={toolsLoading}
                    selectedTools={selectedTools}
                    onChange={setSelectedTools}
                />

                <div id={styles.description}>
                    <label htmlFor="description">
                        Description de l'intervention :
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        placeholder="ex : semis de blé dans la parcelle nord"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={4}
                        cols={50}
                        disabled={isLoading || status === "REFUSEE"}
                    />
                </div>

                {successMessage && (
                    <p className="success">{successMessage}</p>
                )}

                {errorMessage && (
                    <p className="error">{errorMessage}</p>
                )}
                <label htmlFor="contestationStatus">
                    Décision :
                    <select
                        id="contestationStatus"
                        value={status}
                        onChange={(event) => setStatus(event.target.value as ContestationStatus)}
                        disabled={isLoading}
                    >
                        <option value="ACCEPTEE">Accepter la contestation</option>
                        <option value="REFUSEE">Refuser la contestation</option>
                    </select>
                </label>
                <AppBtn
                    color="dark"
                    type="submit"
                    label={isLoading ? "Résolution..." : "Valider la décision"}
                />
            </form>
        </section>
    );
}