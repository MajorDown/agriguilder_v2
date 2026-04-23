import { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import { CreateAdjustmentInput } from '../adjustment.types';
import { getGuildByName } from '@/modules/guild/services/getGuildByName.service';

export async function createAdjustmentService(input: CreateAdjustmentInput): Promise<void> {
    try {
        const guild = await getGuildByName(input.guildName);
        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: 'GUILD_NOT_FOUND',
                message: 'Guilde non trouvée',
            });
        }
        await prisma.adjustment.create({
            data: {
                guild_id: guild.id,
                member_id: input.memberId,
                admin_id: input.adminId,
                amount: input.amount,
                reason: input.reason,
                type: input.type,
            },
        });
        await prisma.member.update({
            where: {
                id: input.memberId,
            },
            data: {
                points_balance: {
                    increment: input.amount,
                },
            },
        })
    }
    catch (error) {
        ErrorManager.create({
            statusCode: 500,
            code: 'ADJUSTMENT_CREATION_FAILED',
            message: 'Echec de la création de l\'ajustement',
        })
    }
}