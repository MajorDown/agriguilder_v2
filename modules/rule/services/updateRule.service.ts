import { prisma} from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { PublicRule, UpdateRuleInput } from "../rule.types";
import LogManager from "@/managers/LogManager";

export async function updateRule(input: UpdateRuleInput): Promise<PublicRule> {
    try {
        const updatedRule = await prisma.rule.update({
            where: { id: input.id },
            data: {
                content: input.content,
            },
        });
        return updatedRule;
    }
    catch (error) {
        LogManager.error(`updateRule - Echec lors de l'update de la rule ${input.id}: ${error instanceof Error ? error.message : String(error)}`);
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "UPDATE_RULE_ERROR",
            message: "Une erreur est survenue lors de la mise à jour du règlement intérieur."
        })
    }
}