'use client';

import AppBtn from "../ui/buttons/AppBtn";
import AppInput from "../ui/inputs/AppInput";
import useCreateReinitialization from "@/hooks/reinitializations/useCreateReinitialization";
import { PublicGuildWithRules } from "@/modules/guild/guild.types";
import styles from "@/styles/components/application/forms/createReinitializationForm.module.css";

export type CreateReinitializationFormProps = {
    guild: PublicGuildWithRules;
    onGuildUpdated?: () => Promise<void>;
};

export default function CreateReinitializationForm(props: CreateReinitializationFormProps) {
    const {
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
        handleNextGuildNameChange,
        handleCityChange,
        handleDepartmentChange,
        handleHumanHourPointValueChange,
        handleMaxDeclarationDelayChange,
        handleMaxContestationDelayChange,
        handlePointEuroValueChange,
        handleSubmit,
        handleDownloadPdf,
        handleOpenPdf,
    } = useCreateReinitialization({
        guild: props.guild,
        onGuildUpdated: props.onGuildUpdated,
    });

    return (
        <div id={styles.container}>
            {!pdfUrl && (
                <>
                    <p className={styles.introduction}>
                        La réinitialisation clôture les soldes actuels, remet les compteurs des membres à zéro
                        et génère immédiatement un rapport PDF non stocké.
                    </p>

                    <form onSubmit={handleSubmit} id={styles.form}>
                        <AppInput
                            label="Nom de la guilde"
                            type="text"
                            value={nextGuildName}
                            onChange={handleNextGuildNameChange}
                            required
                        />

                        <div className={styles.inlineFields}>
                            <AppInput
                                label="Ville"
                                type="text"
                                value={city}
                                onChange={handleCityChange}
                                required
                            />

                            <AppInput
                                label="Département"
                                type="text"
                                value={department}
                                onChange={handleDepartmentChange}
                                required
                            />
                        </div>

                        <AppInput
                            label="Valeur du guilder en heure humaine"
                            type="number"
                            value={humanHourPointValue}
                            onChange={handleHumanHourPointValueChange}
                            min={0}
                            step={0.01}
                            required
                        />

                        <div className={styles.inlineFields}>
                            <AppInput
                                label="Délai maximal de déclaration"
                                type="number"
                                value={maxDeclarationDelay}
                                onChange={handleMaxDeclarationDelayChange}
                                min={0}
                                step={1}
                                required
                            />

                            <AppInput
                                label="Délai maximal de contestation"
                                type="number"
                                value={maxContestationDelay}
                                onChange={handleMaxContestationDelayChange}
                                min={0}
                                step={1}
                                required
                            />
                        </div>

                        <AppInput
                            label="Valeur du guilder en euro"
                            type="number"
                            value={pointEuroValue}
                            onChange={handlePointEuroValueChange}
                            min={0}
                            step={0.01}
                            required
                        />

                        <p className={styles.warning}>
                            Cette action est définitive pour les soldes actuels des membres.
                        </p>

                        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                        {successMessage && <p className={styles.success}>{successMessage}</p>}

                        <AppBtn
                            label={isSubmitting ? "Validation..." : "Valider la réinitialisation"}
                            color="dark"
                            type="submit"
                        />
                    </form>
                </>
            )}

            {pdfUrl && (
                <section className={styles.previewSection}>
                    <div className={styles.previewHeader}>
                        <div>
                            <h4>Aperçu du rapport PDF</h4>
                            <p>{pdfFileName ?? "rapport-reinitialisation.pdf"}</p>
                        </div>

                        <div className={styles.previewActions}>
                            <AppBtn
                                label="Ouvrir dans un onglet"
                                color="light"
                                onClick={handleOpenPdf}
                            />
                            <AppBtn
                                label="Télécharger le PDF"
                                color="green"
                                onClick={handleDownloadPdf}
                            />
                        </div>
                    </div>

                    {successMessage && <p className={styles.success}>{successMessage}</p>}

                    <iframe
                        src={pdfUrl}
                        title="Aperçu du rapport de réinitialisation"
                        className={styles.previewFrame}
                    />
                </section>
            )}
        </div>
    );
}
