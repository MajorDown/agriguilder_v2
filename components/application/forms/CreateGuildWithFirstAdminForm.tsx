"use client";

import { useState } from "react";
import AppBtn from "@/components/application/ui/buttons/AppBtn";
import AppInput from "@/components/application/ui/inputs/AppInput";
import useCreateFirstGuildAdmin from "@/hooks/admin/useCreateFirstGuildAdmin";
import useCreateGuild from "@/hooks/guild/useCreateGuild";
import type { CreatedGuild } from "@/modules/guild/guild.types";
import styles from "@/styles/components/application/forms/createGuildWithFirstAdminForm.module.css";

type Step = "guild" | "admin" | "done";

type GuildFormValues = {
    name: string;
    city: string;
    department: string;
    humanHourPointValue: string;
    maxDeclarationDelay: string;
    maxContestationDelay: string;
};

type AdminFormValues = {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    society: string;
};

const initialGuildValues: GuildFormValues = {
    name: "",
    city: "",
    department: "",
    humanHourPointValue: "1",
    maxDeclarationDelay: "7",
    maxContestationDelay: "7",
};

const initialAdminValues: AdminFormValues = {
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    society: "",
};

export default function CreateGuildWithFirstAdminForm() {
    const [step, setStep] = useState<Step>("guild");
    const [guildValues, setGuildValues] = useState<GuildFormValues>(initialGuildValues);
    const [adminValues, setAdminValues] = useState<AdminFormValues>(initialAdminValues);
    const [createdGuild, setCreatedGuild] = useState<CreatedGuild | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const createGuild = useCreateGuild();
    const createFirstAdmin = useCreateFirstGuildAdmin();

    function setGuildField<K extends keyof GuildFormValues>(key: K, value: GuildFormValues[K]) {
        setGuildValues((prev) => ({
            ...prev,
            [key]: value,
        }));
        setFormError(null);
    }

    function setAdminField<K extends keyof AdminFormValues>(key: K, value: AdminFormValues[K]) {
        setAdminValues((prev) => ({
            ...prev,
            [key]: value,
        }));
        setFormError(null);
    }

    async function submitGuild() {
        setFormError(null);

        const payload = {
            name: guildValues.name.trim(),
            city: guildValues.city.trim(),
            department: guildValues.department.trim(),
            humanHourPointValue: Number(guildValues.humanHourPointValue),
            maxDeclarationDelay: Number(guildValues.maxDeclarationDelay),
            maxContestationDelay: Number(guildValues.maxContestationDelay),
        };

        if (!payload.name || !payload.city || !payload.department) {
            setFormError("Le nom, la ville et le département sont obligatoires");
            return;
        }

        if (
            Number.isNaN(payload.humanHourPointValue) ||
            Number.isNaN(payload.maxDeclarationDelay) ||
            Number.isNaN(payload.maxContestationDelay)
        ) {
            setFormError("Les valeurs numériques de la guilde sont invalides");
            return;
        }

        if (
            payload.humanHourPointValue < 0 ||
            payload.maxDeclarationDelay < 0 ||
            payload.maxContestationDelay < 0
        ) {
            setFormError("Les valeurs numériques ne peuvent pas être négatives");
            return;
        }

        const guild = await createGuild.create(payload);

        if (!guild) {
            return;
        }

        setCreatedGuild(guild);
        setStep("admin");
    }

    async function submitAdmin() {
        setFormError(null);

        if (!createdGuild) {
            setFormError("La guilde doit être créée avant son premier admin");
            return;
        }

        const payload = {
            guildId: createdGuild.id,
            email: adminValues.email.trim(),
            firstname: adminValues.firstname.trim(),
            lastname: adminValues.lastname.trim(),
            phone: adminValues.phone.trim(),
            society: adminValues.society.trim() || undefined,
        };

        if (!payload.email || !payload.firstname || !payload.lastname || !payload.phone) {
            setFormError("L'email, le prénom, le nom et le téléphone sont obligatoires");
            return;
        }

        const admin = await createFirstAdmin.create(payload);

        if (!admin) {
            return;
        }

        setStep("done");
    }

    function resetFlow() {
        setStep("guild");
        setGuildValues(initialGuildValues);
        setAdminValues(initialAdminValues);
        setCreatedGuild(null);
        setFormError(null);
        createGuild.reset();
        createFirstAdmin.reset();
    }

    const currentError = formError ?? createGuild.error ?? createFirstAdmin.error;

    return (
        <section className={styles.wrapper}>
            <div className={styles.steps}>
                <p className={step === "guild" ? styles.activeStep : ""}>1. Guilde</p>
                <p className={step === "admin" ? styles.activeStep : ""}>2. Premier admin</p>
                <p className={step === "done" ? styles.activeStep : ""}>3. Terminé</p>
            </div>

            {step === "guild" && (
                <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
                    <h2>Créer la guilde</h2>
                    <AppInput
                        label="Nom de la guilde"
                        type="text"
                        value={guildValues.name}
                        onChange={(value) => setGuildField("name", value)}
                        placeholder="Ex : CUMA du Bocage"
                    />
                    <AppInput
                        label="Ville"
                        type="text"
                        value={guildValues.city}
                        onChange={(value) => setGuildField("city", value)}
                        placeholder="Ex : Bournezeau"
                    />
                    <AppInput
                        label="Département"
                        type="text"
                        value={guildValues.department}
                        onChange={(value) => setGuildField("department", value)}
                        placeholder="Ex : 85"
                    />
                    <AppInput
                        label="Valeur d'une heure humaine"
                        type="number"
                        value={guildValues.humanHourPointValue}
                        onChange={(value) => setGuildField("humanHourPointValue", value)}
                        min={0}
                        step={0.01}
                    />
                    <AppInput
                        label="Délai max de déclaration"
                        type="number"
                        value={guildValues.maxDeclarationDelay}
                        onChange={(value) => setGuildField("maxDeclarationDelay", value)}
                        min={0}
                        step={1}
                        hint="En jours"
                    />
                    <AppInput
                        label="Délai max de contestation"
                        type="number"
                        value={guildValues.maxContestationDelay}
                        onChange={(value) => setGuildField("maxContestationDelay", value)}
                        min={0}
                        step={1}
                        hint="En jours"
                    />
                    {currentError && <p className="error">{currentError}</p>}
                    <AppBtn
                        label={createGuild.isLoading ? "Création..." : "Créer la guilde"}
                        color="dark"
                        onClick={submitGuild}
                    />
                </form>
            )}

            {step === "admin" && createdGuild && (
                <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
                    <h2>Créer le premier admin</h2>
                    <p className={styles.notice}>
                        Créons maintenant le premier admin de la guilde.
                    </p>
                    <AppInput
                        label="Email"
                        type="email"
                        value={adminValues.email}
                        onChange={(value) => setAdminField("email", value)}
                        placeholder="admin@example.fr"
                    />
                    <AppInput
                        label="Prénom"
                        type="text"
                        value={adminValues.firstname}
                        onChange={(value) => setAdminField("firstname", value)}
                    />
                    <AppInput
                        label="Nom"
                        type="text"
                        value={adminValues.lastname}
                        onChange={(value) => setAdminField("lastname", value)}
                    />
                    <AppInput
                        label="Téléphone"
                        type="tel"
                        value={adminValues.phone}
                        onChange={(value) => setAdminField("phone", value)}
                    />
                    <AppInput
                        label="Société"
                        type="text"
                        value={adminValues.society}
                        onChange={(value) => setAdminField("society", value)}
                    />
                    {currentError && <p className="error">{currentError}</p>}
                    <div className={styles.actions}>
                        <AppBtn
                            label="Retour"
                            color="green"
                            onClick={() => setStep("guild")}
                        />
                        <AppBtn
                            label={createFirstAdmin.isLoading ? "Création..." : "Créer le premier admin"}
                            color="dark"
                            onClick={submitAdmin}
                        />
                    </div>
                </form>
            )}

            {step === "done" && createdGuild && createFirstAdmin.createdAdmin && (
                <div className={styles.done}>
                    <h2>Guilde initialisée</h2>
                    <p>
                        La guilde <strong>{createdGuild.name}</strong> et son premier admin{" "}
                        <strong>{createFirstAdmin.createdAdmin.email}</strong> ont été créés.
                    </p>
                    <AppBtn
                        label="Créer une autre guilde"
                        color="dark"
                        onClick={resetFlow}
                    />
                </div>
            )}
        </section>
    );
}
