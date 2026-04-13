import { FormEvent, useEffect, useMemo, useState } from "react";
import FetchManager from "@/managers/FetchManager";
import useUserContext from "@/contexts/userContext/useUserContext";

export default function useUpdateUserInfos(onSuccess?: () => void) {
    const { user } = useUserContext();

    const initialValues = useMemo(() => ({
        firstname: user?.firstname ?? "",
        lastname: user?.lastname ?? "",
        phone: user?.phone ?? "",
        society: user?.society ?? "",
    }), [user]);

    const [firstname, setFirstname] = useState(initialValues.firstname);
    const [lastname, setLastname] = useState(initialValues.lastname);
    const [phone, setPhone] = useState(initialValues.phone);
    const [society, setSociety] = useState(initialValues.society);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasChanged = useMemo(() => {
        return (
            firstname.trim() !== initialValues.firstname.trim() ||
            lastname.trim() !== initialValues.lastname.trim() ||
            phone.trim() !== initialValues.phone.trim() ||
            society.trim() !== initialValues.society.trim()
        );
    }, [firstname, lastname, phone, society, initialValues]);

    useEffect(() => {
        setFirstname(initialValues.firstname);
        setLastname(initialValues.lastname);
        setPhone(initialValues.phone);
        setSociety(initialValues.society);
    }, [initialValues]);

    const submit = async (event?: FormEvent<HTMLFormElement>): Promise<boolean> => {
        event?.preventDefault();

        try {
            setErrorMessage(null);

            const trimmedFirstname = firstname.trim();
            const trimmedLastname = lastname.trim();
            const trimmedPhone = phone.trim();
            const trimmedSociety = society.trim();

            if (!trimmedFirstname) {
                setErrorMessage("Le prénom est requis.");
                return false;
            }

            if (!trimmedLastname) {
                setErrorMessage("Le nom est requis.");
                return false;
            }

            if (!trimmedPhone) {
                setErrorMessage("Le numéro de téléphone est requis.");
                return false;
            }

            if (!trimmedSociety) {
                setErrorMessage("Le nom de l'entreprise est requis.");
                return false;
            }

            if (!hasChanged) {
                return true;
            }

            setIsLoading(true);

            await FetchManager.fetch("/api/user/update/infos", {
                method: "PUT",
                body: JSON.stringify({
                    firstname: trimmedFirstname,
                    lastname: trimmedLastname,
                    phone: trimmedPhone,
                    society: trimmedSociety,
                }),
            });

            onSuccess?.();
            return true;
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la mise à jour des informations."
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        firstname,
        lastname,
        phone,
        society,
        setFirstname,
        setLastname,
        setPhone,
        setSociety,
        isLoading,
        errorMessage,
        hasChanged,
        submit,
    };
}