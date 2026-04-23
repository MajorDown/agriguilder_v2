import { Adjustment, AdjustmentType} from "@/prisma/generated/prisma/client";

export type PublicAdjustment = Omit<Adjustment, 'member_id' | 'guild_id' | 'created_at'>;

export const adjustmentReasons= [
    'initialisation individuelle du solde',
    'initialisation des soldes de la guilde',
    "correction d'erreur solde",
    'compensation pour un événement'
]

export type AdjustmentReason = typeof adjustmentReasons[number];

export type CreateAdjustmentInput = {
    guildName: string;
    memberId: string;
    adminId: string;
    amount: number;
    reason: AdjustmentReason;
    type: AdjustmentType;
}