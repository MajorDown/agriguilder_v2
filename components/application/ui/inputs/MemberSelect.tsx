import useUserContext from "@/contexts/userContext/useUserContext"
import useGetMembers from '@/hooks/members/useMemberTable';
import styles from '@/styles/components/application/ui/inputs/memberSelect.module.css';

export type MemberSelectOptions = {
    selectedMemberId: string;
    onChange: (memberId: string) => void;
}

export default function MemberSelect(props : MemberSelectOptions) {
    const { user, selectedGuild } = useUserContext();
    const { members, isLoading } = useGetMembers(selectedGuild ?? "");

    return (<div className={styles.container}>
        <label htmlFor="memberSelect">Sélectionner le membre bénéficiaire :</label>
        <select
            name="memberSelect"
            className={styles.select}
            value={props.selectedMemberId} 
            onChange={(e) => props.onChange(e.target.value)}
            >
            <option value="">{isLoading ? "Chargement..." : "Sélectionner un membre"}</option>
            {members.map(member => (<option key={member.id} value={member.id}>
                {member.firstname} {member.lastname} {member.society && `(${member.society})`}
            </option>))}
        </select>
    </div>)
}