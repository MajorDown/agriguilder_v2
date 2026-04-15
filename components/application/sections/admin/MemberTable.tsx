'use client';
import { PublicMember } from "@/modules/member/member.types";
import MemberLine from "./MemberLine";
import styles from "@/styles/components/application/sections/membersTable.module.css";
import AppBtn from "@/components/application/ui/buttons/AppBtn";
import { useMemo, useState } from "react";
import useModal from "@/contexts/modalContext/useModal";
import CreateMemberForm from "../../forms/CreateMemberForm";
import useMemberTable from "@/hooks/members/useMemberTable";
import AppSpinner from "../../ui/AppSpinner";

export type MembersTableProps = {
    guildName: string;
    isAdminView?: boolean;
};

type MemberSortOption = "society" | "lastname" | "solde";

export default function MembersTable(props: MembersTableProps) {
    const { openModal, closeModal } = useModal();
    const { members, isLoading, errorMessage, refreshMembers } = useMemberTable(props.guildName);
    const [sortBy, setSortBy] = useState<MemberSortOption>("society");

    const sortedMembers = useMemo(() => {
        const membersCopy = [...members];

        if (sortBy === "society") {
            return membersCopy.sort((a, b) => (a.society ?? "").localeCompare(b.society ?? "", "fr"));
        }

        if (sortBy === "lastname") {
            return membersCopy.sort((a, b) => (a.lastname ?? "").localeCompare(b.lastname ?? "", "fr"));
        }

        if (sortBy === "solde") {
            return membersCopy.sort((a, b) => b.points_balance - a.points_balance);
        }

        return membersCopy;
    }, [members, sortBy]);

    const handleOpenModal = () => {
        openModal({
            title: "Créer un nouveau membre",
            content: (
                <CreateMemberForm
                    guildName={props.guildName}
                    onSuccess={async () => {
                        closeModal();
                        await refreshMembers();
                    }}
                />
            )
        });
    };

    if (isLoading) {
        return (
            <section id={styles.memberTable}>
                <p>Chargement des membres...</p>
                <AppSpinner />
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section id={styles.memberTable}>
                <p>{errorMessage}</p>
            </section>
        );
    }

    if (members.length === 0) {
        return (
            <section id={styles.memberTable}>
                <div id={styles.memberTableHeader}>
                    <label htmlFor="member-sort">
                        Trier par
                        <select
                            id="member-sort"
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as MemberSortOption)}
                        >
                            <option value="society">Société</option>
                            <option value="lastname">Nom de famille</option>
                            <option value="solde">Solde</option>
                        </select>
                    </label>

                    {props.isAdminView && (<AppBtn
                        onClick={handleOpenModal}
                        color="light"
                        label="Créer un nouveau membre"
                    />)}
                </div>

                <p>Aucun membre trouvé pour cette guilde.</p>
            </section>
        );
    }

    return (
        <section id={styles.memberTable}>
            <div id={styles.memberTableHeader}>
                <label htmlFor="member-sort">
                    Trier par
                    <select
                        id="member-sort"
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value as MemberSortOption)}
                    >
                        <option value="society">Société</option>
                        <option value="lastname">Nom de famille</option>
                        <option value="solde">Solde</option>
                    </select>
                </label>
                {props.isAdminView && (<AppBtn
                    onClick={handleOpenModal}
                    color="light"
                    label="Créer un nouveau membre"
                />)}
            </div>
            <div id={styles.indexLine}>
                <p>identité</p>
                <p>coordonnées</p>
                <p>solde</p>
                <p>ancienneté</p>
            </div>
            {sortedMembers.map((member: PublicMember) => (
                <MemberLine
                    key={member.id}
                    member={member}
                    guildName={props.guildName}
                    viewMode={props.isAdminView ? "admin" : "member"}
                    onMemberDeleted={refreshMembers}
                />
            ))}
        </section>
    );
}