import { prisma } from "@/prisma/prisma";
import { UpdateToolInput } from "../tool.types";
import ErrorManager from "@/managers/ErrorManager";

/**
 * @description update un tool existant
 * @param {UpdateToolInput} input - les données pour mettre à jour le tool
 * @returns {Promise<void>} - une promesse qui se résout lorsque le tool est mis à jour
 */
export async function updateTool(input: UpdateToolInput): Promise<void> {
    try {
        await prisma.tool.update({
            where: {
                id: input.id,
                revoked_at: null,
            },
            data: {
                name: input.name,
                coef: input.coef,
                version: {
                    increment: 1,
                }
            },
        });
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: 'TOOL_UPDATE_FAILED',
            message: 'An error occurred while updating the tool.',
        })
    }
}