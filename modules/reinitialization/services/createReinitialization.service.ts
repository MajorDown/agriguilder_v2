import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import LogManager from "@/managers/LogManager";
import { updateGuildMembersPointsBalance } from "@/modules/guild/services/updateGuildPointsBalances.service";
import {
    CreateReinitializationInput,
    CreateReinitializationResult,
    ReinitializationReportLine,
} from "../reinitialization.types";

function assertPositiveOrZero(value: number, field: string) {
    if (value < 0) {
        throw ErrorManager.create({
            statusCode: 400,
            code: "INVALID_REINITIALIZATION_INPUT",
            message: `Le champ ${field} doit être positif ou nul`,
        });
    }
}

export async function createReinitialization(
    input: CreateReinitializationInput
): Promise<CreateReinitializationResult> {
    try {
        const enforcedMaxValidationDelay = 0;

        if (!input.confirm) {
            throw ErrorManager.create({
                statusCode: 400,
                code: "REINITIALIZATION_NOT_CONFIRMED",
                message: "La réinitialisation doit être confirmée avant validation",
            });
        }

        assertPositiveOrZero(input.humanHourPointValue, "humanHourPointValue");
        assertPositiveOrZero(input.maxDeclarationDelay, "maxDeclarationDelay");
        assertPositiveOrZero(input.maxContestationDelay, "maxContestationDelay");
        assertPositiveOrZero(input.pointEuroValue, "pointEuroValue");

        const currentGuild = await prisma.guild.findUnique({
            where: {
                name: input.guildName,
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!currentGuild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: "Guilde introuvable",
            });
        }

        if (input.nextGuildName !== input.guildName) {
            const guildWithNextName = await prisma.guild.findUnique({
                where: {
                    name: input.nextGuildName,
                },
                select: {
                    id: true,
                },
            });

            if (guildWithNextName) {
                throw ErrorManager.create({
                    statusCode: 409,
                    code: "GUILD_NAME_ALREADY_USED",
                    message: "Le nouveau nom de guilde est déjà utilisé",
                });
            }
        }

        await updateGuildMembersPointsBalance(currentGuild.id);

        const result = await prisma.$transaction(async (tx) => {
            const guild = await tx.guild.findUnique({
                where: {
                    id: currentGuild.id,
                },
                select: {
                    id: true,
                    name: true,
                    members: {
                        where: {
                            revoked_at: null,
                        },
                        select: {
                            id: true,
                            points_balance: true,
                            user: {
                                select: {
                                    firstname: true,
                                    lastname: true,
                                    email: true,
                                },
                            },
                        },
                        orderBy: [
                            {
                                user: {
                                    lastname: "asc",
                                },
                            },
                            {
                                user: {
                                    firstname: "asc",
                                },
                            },
                        ],
                    },
                },
            });

            if (!guild) {
                throw ErrorManager.create({
                    statusCode: 404,
                    code: "GUILD_NOT_FOUND",
                    message: "Guilde introuvable",
                });
            }

            const admin = await tx.admin.findUnique({
                where: {
                    id: input.adminId,
                },
                select: {
                    user: {
                        select: {
                            firstname: true,
                            lastname: true,
                        },
                    },
                },
            });

            if (!admin) {
                throw ErrorManager.create({
                    statusCode: 404,
                    code: "ADMIN_NOT_FOUND",
                    message: "Admin introuvable",
                });
            }

            const reportLines: ReinitializationReportLine[] = guild.members.map((member) => ({
                memberId: member.id,
                firstname: member.user.firstname,
                lastname: member.user.lastname,
                email: member.user.email,
                pointsBalance: member.points_balance,
                euroValue: member.points_balance * input.pointEuroValue,
            }));

            const updatedGuild = await tx.guild.update({
                where: {
                    id: guild.id,
                },
                data: {
                    name: input.nextGuildName,
                    city: input.city,
                    department: input.department,
                    human_hour_point_value: input.humanHourPointValue,
                    max_declaration_delay: input.maxDeclarationDelay,
                    max_validation_delay: enforcedMaxValidationDelay,
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

            const reinitialization = await tx.reinitialization.create({
                data: {
                    guild_id: guild.id,
                    admin_id: input.adminId,
                    point_euro_value: input.pointEuroValue,
                },
                select: {
                    id: true,
                    created_at: true,
                },
            });

            await tx.member.updateMany({
                where: {
                    guild_id: guild.id,
                    revoked_at: null,
                },
                data: {
                    points_balance: 0,
                },
            });

            return {
                reinitialization,
                updatedGuild,
                validatedBy: `${admin.user.firstname} ${admin.user.lastname}`,
                reportLines,
                previousGuildName: guild.name,
            };
        });

        LogManager.info(
            `Réinitialisation effectuée pour la guilde ${result.previousGuildName} -> ${result.updatedGuild.name}`
        );

        return {
            reinitializationId: result.reinitialization.id,
            guildId: currentGuild.id,
            guildName: result.updatedGuild.name,
            createdAt: result.reinitialization.created_at,
            report: {
                generatedAt: result.reinitialization.created_at,
                validatedBy: result.validatedBy,
                previousGuildName: result.previousGuildName,
                guildName: result.updatedGuild.name,
                city: result.updatedGuild.city,
                department: result.updatedGuild.department,
                humanHourPointValue: result.updatedGuild.human_hour_point_value,
                maxDeclarationDelay: result.updatedGuild.max_declaration_delay,
                maxValidationDelay: enforcedMaxValidationDelay,
                maxContestationDelay: result.updatedGuild.max_contestation_delay,
                pointEuroValue: input.pointEuroValue,
                lines: result.reportLines,
            },
        };
    } catch (error) {
        LogManager.error(`Echec de la réinitialisation de guilde: ${error}`);
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "CREATE_REINITIALIZATION_FAILED",
            message: "La réinitialisation de la guilde a échoué",
        });
    }
}
