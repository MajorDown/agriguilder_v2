import { Tool } from "@/prisma/generated/prisma/client";

export type PublicTool = Omit<Tool, 'created_at' | 'revoked_at' | 'admin_id' | 'guild_id'>;

export type CreateToolInput = {
    adminId: string;
    name: string;
    coef: number;
    guildName: string;
}

export type UpdateToolInput = {
    id: string;
    name?: string;
    coef?: number;
    guildName: string;
}

export type ToggleToolInput = {
    id: string;
    isActive: boolean;
}
