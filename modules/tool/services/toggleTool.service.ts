import { ToggleToolInput } from "../tool.types";
import ErrorManager from "@/managers/ErrorManager";
import { prisma } from "@/prisma/prisma";

export async function toggleTool(input: ToggleToolInput): Promise<void> {
    try {
        await prisma.tool.update({
            where: {
                id: input.id,
            },
            data: {
                is_active: input.isActive,
            },
        });
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "TOGGLE_TOOL_ERROR",
            message: "Une erreur est survenue lors du changement de statut de l'outil.",
        })
    }
}