'use client';

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import useUserContext from "@/contexts/userContext/useUserContext";
import { PublicGuildWithRules } from "@/modules/guild/guild.types";

type UseCreateReinitializationParams = {
    guild: PublicGuildWithRules;
    onGuildUpdated?: () => Promise<void>;
};

type ApiErrorResponse = {
    success: false;
    message?: string;
    error?: {
        message?: string;
        code?: string;
    };
};

export type UseCreateReinitializationReturn = {
    nextGuildName: string;
    city: string;
    department: string;
    humanHourPointValue: string;
    maxDeclarationDelay: string;
    maxContestationDelay: string;
    pointEuroValue: string;
    isSubmitting: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    pdfUrl: string | null;
    pdfFileName: string | null;
    handleNextGuildNameChange: (value: string) => void;
    handleCityChange: (value: string) => void;
    handleDepartmentChange: (value: string) => void;
    handleHumanHourPointValueChange: (value: string) => void;
    handleMaxDeclarationDelayChange: (value: string) => void;
    handleMaxContestationDelayChange: (value: string) => void;
    handlePointEuroValueChange: (value: string) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    handleDownloadPdf: () => void;
    handleOpenPdf: () => void;
};

function getFileNameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) {
        return null;
    }

    const utf8Match = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
        try {
            return decodeURIComponent(utf8Match[1]);
        } catch {
        }
    }

    const match = contentDisposition.match(/filename="([^"]+)"/i);

    return match?.[1] ?? null;
}

function getApiErrorMessage(errorBody: ApiErrorResponse | null, fallback: string): string {
    if (!errorBody) {
        return fallback;
    }

    return errorBody.error?.message ?? errorBody.message ?? fallback;
}

export default function useCreateReinitialization(
    params: UseCreateReinitializationParams
): UseCreateReinitializationReturn {
    const { guild, onGuildUpdated } = params;
    const { selectedGuild, setSelectedGuild, refreshUser } = useUserContext();

    const [nextGuildName, setNextGuildName] = useState<string>(guild.name);
    const [city, setCity] = useState<string>(guild.city);
    const [department, setDepartment] = useState<string>(guild.department);
    const [humanHourPointValue, setHumanHourPointValue] = useState<string>(String(guild.human_hour_point_value));
    const [maxDeclarationDelay, setMaxDeclarationDelay] = useState<string>(String(guild.max_declaration_delay));
    const [maxContestationDelay, setMaxContestationDelay] = useState<string>(String(guild.max_contestation_delay));
    const [pointEuroValue, setPointEuroValue] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfFileName, setPdfFileName] = useState<string | null>(null);

    const pdfUrlRef = useRef<string | null>(null);

    useEffect(() => {
        setNextGuildName(guild.name);
        setCity(guild.city);
        setDepartment(guild.department);
        setHumanHourPointValue(String(guild.human_hour_point_value));
        setMaxDeclarationDelay(String(guild.max_declaration_delay));
        setMaxContestationDelay(String(guild.max_contestation_delay));
    }, [guild]);

    useEffect(() => {
        return () => {
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
            }
        };
    }, []);

    const handleDownloadPdf = useCallback(() => {
        if (!pdfUrl) {
            return;
        }

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = pdfFileName ?? "rapport-reinitialisation.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [pdfFileName, pdfUrl]);

    const handleOpenPdf = useCallback(() => {
        if (!pdfUrl) {
            return;
        }

        window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }, [pdfUrl]);

    const triggerPdfDownload = useCallback((url: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage(null);
        setSuccessMessage(null);

        const trimmedNextGuildName = nextGuildName.trim();
        const trimmedCity = city.trim();
        const trimmedDepartment = department.trim();
        const trimmedPointEuroValue = pointEuroValue.trim();

        if (!trimmedNextGuildName) {
            setErrorMessage("Le nom de guilde est obligatoire.");
            return;
        }

        if (!trimmedCity) {
            setErrorMessage("La ville est obligatoire.");
            return;
        }

        if (!trimmedDepartment) {
            setErrorMessage("Le département est obligatoire.");
            return;
        }

        if (!trimmedPointEuroValue) {
            setErrorMessage("La valeur en euros du point est obligatoire.");
            return;
        }

        const parsedHumanHourPointValue = Number(humanHourPointValue);
        const parsedMaxDeclarationDelay = Number(maxDeclarationDelay);
        const parsedMaxContestationDelay = Number(maxContestationDelay);
        const parsedPointEuroValue = Number(trimmedPointEuroValue);

        if ([
            parsedHumanHourPointValue,
            parsedMaxDeclarationDelay,
            parsedMaxContestationDelay,
            parsedPointEuroValue,
        ].some((value) => Number.isNaN(value))) {
            setErrorMessage("Tous les champs numériques doivent contenir une valeur valide.");
            return;
        }

        if (
            parsedHumanHourPointValue < 0
            || parsedMaxDeclarationDelay < 0
            || parsedMaxContestationDelay < 0
            || parsedPointEuroValue < 0
        ) {
            setErrorMessage("Les champs numériques doivent être positifs ou nuls.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await FetchManager.fetch("/api/reinitialization/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    guildName: guild.name,
                    nextGuildName: trimmedNextGuildName,
                    city: trimmedCity,
                    department: trimmedDepartment,
                    humanHourPointValue: parsedHumanHourPointValue,
                    maxDeclarationDelay: parsedMaxDeclarationDelay,
                    maxValidationDelay: 0,
                    maxContestationDelay: parsedMaxContestationDelay,
                    pointEuroValue: parsedPointEuroValue,
                    confirm: true,
                }),
            });

            if (!response.ok) {
                let errorBody: ApiErrorResponse | null = null;

                try {
                    errorBody = await response.json();
                } catch {
                    errorBody = null;
                }

                setErrorMessage(
                    getApiErrorMessage(errorBody, "Impossible de valider la réinitialisation.")
                );
                return;
            }

            const pdfBlob = await response.blob();
            const nextPdfUrl = URL.createObjectURL(pdfBlob);

            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
            }

            pdfUrlRef.current = nextPdfUrl;
            setPdfUrl(nextPdfUrl);

            const nextPdfFileName = (
                getFileNameFromContentDisposition(response.headers.get("Content-Disposition"))
                ?? "rapport-reinitialisation.pdf"
            );

            setPdfFileName(nextPdfFileName);
            setSuccessMessage("Réinitialisation validée. Le rapport PDF est prêt.");
            triggerPdfDownload(nextPdfUrl, nextPdfFileName);

            const updatedGuildName = response.headers.get("X-Updated-Guild-Name") ?? trimmedNextGuildName;

            await refreshUser();

            if (selectedGuild !== updatedGuildName) {
                setSelectedGuild(updatedGuildName);
            } else if (onGuildUpdated) {
                await onGuildUpdated();
            }
        } catch (error) {
            console.error("Erreur lors de la réinitialisation :", error);
            setErrorMessage("Une erreur est survenue lors de la réinitialisation.");
        } finally {
            setIsSubmitting(false);
        }
    }, [
        city,
        department,
        guild.name,
        humanHourPointValue,
        maxContestationDelay,
        maxDeclarationDelay,
        nextGuildName,
        onGuildUpdated,
        pointEuroValue,
        refreshUser,
        selectedGuild,
        setSelectedGuild,
        triggerPdfDownload,
    ]);

    return {
        nextGuildName,
        city,
        department,
        humanHourPointValue,
        maxDeclarationDelay,
        maxContestationDelay,
        pointEuroValue,
        isSubmitting,
        errorMessage,
        successMessage,
        pdfUrl,
        pdfFileName,
        handleNextGuildNameChange: setNextGuildName,
        handleCityChange: setCity,
        handleDepartmentChange: setDepartment,
        handleHumanHourPointValueChange: setHumanHourPointValue,
        handleMaxDeclarationDelayChange: setMaxDeclarationDelay,
        handleMaxContestationDelayChange: setMaxContestationDelay,
        handlePointEuroValueChange: setPointEuroValue,
        handleSubmit,
        handleDownloadPdf,
        handleOpenPdf,
    };
}
