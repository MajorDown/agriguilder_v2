import { prisma} from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { DeleteRuleInput } from "../rule.types";
import LogManager from "@/managers/LogManager";

export async function deleteRule(input: DeleteRuleInput): Promise<void> {
    try {
        await prisma.rule.delete({
            where: { id: input.id },
        });
    }
    catch (error) {
        LogManager.error(`deleteRule - Echec lors de la suppression de la rule ${input.id}: ${error instanceof Error ? error.message : String(error)}`);
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "DELETE_RULE_ERROR",
            message: "Une erreur est survenue lors de la suppression du règlement intérieur."
        })
    }
}