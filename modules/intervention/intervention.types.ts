import { Intervention, Tool } from "@/prisma/generated/prisma/client";
import { PublicMember } from "../member/member.types";
import { PublicTool } from "../tool/tool.types";

export type PublicIntervention = Omit<Intervention, "workerId" | "payerId" | "guildId"> & {
    worker: PublicMember;
    payer: PublicMember;
    guildName: string;
    tools: PublicTool[];
}

export type CreateInterventionInput = {
    guildName: string;
    workerId: string;
    payerId: string;
    day: string;
    duration: number;
    tools: string[];
    description?: string | null;
}