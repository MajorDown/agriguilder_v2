import { useState } from "react";
import useCheckMemberByEmail from "./useCheckMemberByEmail";
import useCreateMember from "./useCreateMember";
import type { CreateMemberInput } from "@/modules/member/member.types";

type RegistrationStep = "email" | "details";

type FormValues = {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    society: string;
};

type UseCreateMemberFormParams = {
    guildName: string;
    onSuccess: () => void;
};

type UseCreateMemberFormReturn = {
    step: RegistrationStep;
    values: FormValues;
    error: string | null;
    checkLoading: boolean;
    createLoading: boolean;
    setField: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;
    checkEmail: () => Promise<void>;
    submit: () => Promise<void>;
    goBackToEmailStep: () => void;
    resetForm: () => void;
};

const initialValues: FormValues = {
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    society: "",
};

export default function useCreateMemberForm(
    params: UseCreateMemberFormParams
): UseCreateMemberFormReturn {
    const [step, setStep] = useState<RegistrationStep>("email");
    const [values, setValues] = useState<FormValues>(initialValues);
    const [error, setError] = useState<string | null>(null);

    const checkMemberByEmail = useCheckMemberByEmail();
    const createMember = useCreateMember();

    function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
        setValues((prev) => ({
            ...prev,
            [key]: value,
        }));

        if (error) {
            setError(null);
        }
    }

    async function checkEmail(): Promise<void> {
        setError(null);

        const trimmedEmail = values.email.trim();

        if (!trimmedEmail) {
            setError("Veuillez renseigner une adresse email");
            return;
        }

        const result = await checkMemberByEmail.checkEmail({
            guildName: params.guildName,
            email: trimmedEmail,
        });

        if (!result.ok) {
            setError(result.error);
            return;
        }

        const data = result.data;

        if (data.status === "USER_EXISTS") {
            setValues((prev) => ({
                ...prev,
                email: data.user.email ?? trimmedEmail,
                firstname: data.user.firstname ?? "",
                lastname: data.user.lastname ?? "",
                phone: data.user.phone ?? "",
                society: data.user.society ?? "",
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                email: trimmedEmail,
            }));
        }

        setStep("details");
    }

    async function submit(): Promise<void> {
        setError(null);

        const payload: CreateMemberInput = {
            guildName: params.guildName,
            email: values.email.trim(),
            firstname: values.firstname.trim(),
            lastname: values.lastname.trim(),
            phone: values.phone.trim(),
            society: values.society.trim() || undefined,
        };

        if (!payload.email) {
            setError("L'email est obligatoire");
            return;
        }

        if (!payload.firstname) {
            setError("Le prénom est obligatoire");
            return;
        }

        if (!payload.lastname) {
            setError("Le nom est obligatoire");
            return;
        }

        if (!payload.phone) {
            setError("Le téléphone est obligatoire");
            return;
        }

        const result = await createMember.create(payload);

        if (!result) {
            setError("Erreur lors de la création du membre");
            return;
        }

        resetForm();
        params.onSuccess();
    }

    function goBackToEmailStep() {
        setError(null);
        setStep("email");
    }

    function resetForm() {
        setStep("email");
        setValues(initialValues);
        setError(null);
        checkMemberByEmail.reset();
        createMember.reset();
    }

    return {
        step,
        values,
        error,
        checkLoading: checkMemberByEmail.isLoading,
        createLoading: createMember.isLoading,
        setField,
        checkEmail,
        submit,
        goBackToEmailStep,
        resetForm,
    };
}