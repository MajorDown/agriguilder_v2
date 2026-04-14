'use client';
import Image from "next/image";
import styles from "@/styles/components/application/sections/membersTable.module.css";
import useModal from "@/contexts/modalContext/useModal";
import { PublicMember } from "@/modules/member/member.types";
import DeleteMemberModal from "@/components/application/sections/admin/DeleteMemberModal";

export type MemberLineProps = {
    member: PublicMember;
    guildName: string;
    viewMode: "admin" | "member";
    onMemberDeleted?: () => void | Promise<void>;
};

/**
 * @description ligne représentant un membre dans MembersTable
 */
export default function MemberLine(props: MemberLineProps) {
    const { openModal, closeModal } = useModal();

    const handleDeleteClick = () => {
        const memberName =
            props.member.society ||
            `${props.member.firstname} ${props.member.lastname}`;
        openModal({
            title: "Supprimer le membre",
            content: <DeleteMemberModal 
                memberId={props.member.id}
                memberFirstName={props.member.firstname}
                guildName={props.guildName}
                onDeleted={props.onMemberDeleted} 
            />,
        });
    };


    return (<div className={styles.memberLine}>
        <div className={styles.identity}>
            {props.member.society && <p>{props.member.society}</p>}
            {(props.member.firstname && props.member.lastname) && 
                (<p>{props.member.firstname} {props.member.lastname}</p>)}
        </div>
        <div className={styles.contact}>
            <p>{props.member.email}</p>
            <p>{props.member.phone}</p>
        </div>
        <p>{props.member.points_balance}⋈</p>
        <div className={styles.historic}>
            <p>membre depuis le</p>
            <p>{new Date(props.member.created_at).toLocaleDateString()}</p>
        </div>
        {props.viewMode === "admin" && (<button type="button" onClick={handleDeleteClick}>
            <Image
                src="/images/icons/trash-dark-on-green.svg"
                alt="delete"
                width={30}
                height={30}
            />
        </button>)}
    </div>)
}