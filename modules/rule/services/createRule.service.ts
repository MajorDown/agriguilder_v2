import { prisma} from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { PublicRule, CreateRuleInput } from "../rule.types";
import LogManager from "@/managers/LogManager";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";

export async function createRule(input: CreateRuleInput): Promise<PublicRule> {
    try {
        const guild = await getGuildByName(input.guildName);
        const newRule = await prisma.rule.create({
            data: {
                content: input.content,
                guild_id: guild.id,
                admin_id: input.adminId,
            },
        });
        return newRule;
    }
    catch (error) {
        LogManager.error(`createRule - Echec lors de la création de la rule : ${error instanceof Error ? error.message : String(error)}`);
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "CREATE_RULE_ERROR",
            message: "Une erreur est survenue lors de la création d'une nouvelle règle."
        })
    }
}