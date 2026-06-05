import ErrorManager, { AppError } from "@/managers/ErrorManager";
import { prisma } from "@/prisma/prisma";
import type { CreateGuildInput, CreatedGuild } from "../guild.types";

function assertPositiveOrZero(value: number, field: string) {
    if (value < 0) {
        throw ErrorManager.create({
            statusCode: 400,
            code: "INVALID_GUILD_INPUT",
            message: `Le champ ${field} doit être positif ou nul`,
        });
    }
}

export async function createGuild(input: CreateGuildInput): Promise<CreatedGuild> {
    try {
        assertPositiveOrZero(input.humanHourPointValue, "humanHourPointValue");
        assertPositiveOrZero(input.maxDeclarationDelay, "maxDeclarationDelay");
        assertPositiveOrZero(input.maxContestationDelay, "maxContestationDelay");

        const existingGuild = await prisma.guild.findUnique({
            where: {
                name: input.name,
            },
            select: {
                id: true,
            },
        });

        if (existingGuild) {
            throw ErrorManager.create({
                statusCode: 409,
                code: "GUILD_ALREADY_EXISTS",
                message: "Une guilde avec ce nom existe déjà",
            });
        }

        return prisma.guild.create({
            data: {
                name: input.name,
                city: input.city,
                department: input.department,
                human_hour_point_value: input.humanHourPointValue,
                max_declaration_delay: input.maxDeclarationDelay,
                max_validation_delay: 0,
                max_contestation_delay: input.maxContestationDelay,
            },
            select: {
                id: true,
                name: true,
                city: true,
                department: true,
                human_hour_point_value: true,
                max_declaration_delay: true,
                max_validation_delay: true,
                max_contestation_delay: true,
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw ErrorManager.create({
            statusCode: 500,
            code: "CREATE_GUILD_FAILED",
            message: "Échec de la création de la guilde",
        });
    }
}
