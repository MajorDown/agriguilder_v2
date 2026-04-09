import { prisma } from "@/prisma/prisma";
import { PublicGuildWithRules } from "../guild.types";
import ErrorManager from "@/managers/ErrorManager";

export async function getGuildInformations(guildName: string): Promise<PublicGuildWithRules> {
    try {
        const guild = await prisma.guild.findUnique({
            where: { name: guildName },
            include: {
                rules: {
                    select: {
                        id: true,
                        content: true,
                        created_at: true,
                    }
                }
            }
        })
        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: `Aucune guilde trouvée avec le nom "${guildName}".`
            })
        }
        const guildWithRules: PublicGuildWithRules = {
            id: guild.id,
            name: guild.name,
            latitude: guild.latitude,
            longitude: guild.longitude,
            city: guild.city,
            department: guild.department,
            human_hour_point_value: guild.human_hour_point_value,
            max_declaration_delay: guild.max_declaration_delay,
            max_validation_delay: guild.max_validation_delay,
            max_contestation_delay: guild.max_contestation_delay,
            created_at: guild.created_at,
            updated_at: guild.updated_at,
            rules: guild.rules.map(rule => ({
                id: rule.id,
                content: rule.content,
                created_at: rule.created_at,
            }))
        }
        return guildWithRules;
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "GUILD_FETCH_ERROR",
            message: "Une erreur est survenue lors de la récupération des informations de la guilde."
        })
    }
}