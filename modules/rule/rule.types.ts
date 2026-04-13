import type { Rule } from "@/prisma/generated/prisma/client";

export type PublicRule = Omit<Rule, "guild_id" | "admin_id">;

export type CreateRuleInput = {
    content: string;
    guildName: string;
    adminId: string;
}

export type UpdateRuleInput = {
    content: string;
    id: string;
}

export type DeleteRuleInput = {
    id: string;
}