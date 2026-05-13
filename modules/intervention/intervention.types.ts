import { Intervention, Tool } from "@/prisma/generated/prisma/client";
import { PublicMember } from "../member/member.types";
import { PublicTool } from "../tool/tool.types";

export type PublicIntervention = Omit<Intervention, "worker_id" | "payer_id" | "guild_id"> & {
    worker: PublicMember;
    payer: PublicMember;
    guildName: string;
    tools: PublicTool[];
    isContestable: boolean;
}

export type CreateInterventionInput = {
    guildName: string;
    workerId: string;
    payerId: string;
    day: string;
    duration: number;
    surface?: number;
    tools: string[];
    description?: string | null;
}