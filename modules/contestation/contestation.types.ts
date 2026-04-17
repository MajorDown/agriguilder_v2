import { Contestation, Intervention } from "@/prisma/generated/prisma/browser";
import { PublicMember } from "../member/member.types";
import { PublicIntervention } from "../intervention/intervention.types";

export type PublicContestation = Omit<Contestation, "contester_id" | "intervention_id"> & {
    intervention: PublicIntervention;
    contester: PublicMember;
}

export type CreateContestationInput = {
    interventionId: string;
    reason: string;
    guildName: string;
    contester_id: string;
}
