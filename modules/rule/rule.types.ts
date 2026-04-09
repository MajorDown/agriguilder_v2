import type { Rule } from "@/prisma/generated/prisma/client";

export type PublicRule = Omit<Rule, "guild_id" | "admin_id">;