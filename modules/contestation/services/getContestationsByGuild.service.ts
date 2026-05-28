import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { PublicContestation } from "../contestation.types";
import { getGuildByName } from "@/modules/guild/services/getGuildByName.service";

/**
 * @description Récupère toutes les contestations d'une guilde à partir de son nom.
 * @param {string} guildName - Le nom de la guilde dont on veut récupérer les contestations.
 * @returns {Promise<PublicContestation[]>} - Une liste de contestations publiques de la guilde.
 * @throws {Error} - Si la guilde n'est pas trouvée ou si une erreur survient lors de la récupération des contestations.
 */
export async function getContestationsByGuild(guildName: string): Promise<PublicContestation[]> {
    try {
        const guild = await getGuildByName(guildName);
        if (!guild) {
            throw ErrorManager.create({
                statusCode: 404,
                code: "GUILD_NOT_FOUND",
                message: "Guilde non trouvée",
            });
        }

        const contestations = await prisma.contestation.findMany({
            where: {
                guild_id: guild.id,
            },
            include: {
                contester: {
                    include: {
                        user: true,
                    },
                },
                intervention: {
                    include: {
                        guild: {
                            select: {
                                name: true,
                            },
                        },
                        worker: {
                            include: {
                                user: true,
                            },
                        },
                        payer: {
                            include: {
                                user: true,
                            },
                        },
                        used_tools: true,
                    },
                },
            },
            orderBy: [
                { created_at: "desc" },
            ],
        });

        const publicContestations: PublicContestation[] = contestations.map((contestation) => {
            return {
                id: contestation.id,
                guild_id: contestation.guild_id,
                reason: contestation.reason,
                resolved_by_admin_id: contestation.resolved_by_admin_id,
                status: contestation.status,
                created_at: contestation.created_at,
                resolved_at: contestation.resolved_at,

                contester: {
                    id: contestation.contester.id,
                    points_balance: contestation.contester.points_balance,
                    created_at: contestation.contester.created_at,

                    email: contestation.contester.user.email,
                    society: contestation.contester.user.society,
                    firstname: contestation.contester.user.firstname,
                    lastname: contestation.contester.user.lastname,
                    phone: contestation.contester.user.phone,
                },

                intervention: {
                    id: contestation.intervention.id,
                    guild_id: contestation.intervention.guild_id,
                    worker_id: contestation.intervention.worker_id,
                    payer_id: contestation.intervention.payer_id,
                    day: contestation.intervention.day,
                    duration: contestation.intervention.duration,
                    surface: contestation.intervention.surface,
                    description: contestation.intervention.description,
                    status: contestation.intervention.status,
                    created_at: contestation.intervention.created_at,
                    updated_at: contestation.intervention.updated_at,
                    guildName: contestation.intervention.guild.name,
                    isContestable: guild?.max_contestation_delay ?
                        (new Date().getTime() - new Date(contestation.intervention.created_at).getTime())
                        <= guild.max_contestation_delay * 24 * 60 * 60 * 1000 : true,

                    worker: {
                        id: contestation.intervention.worker.id,
                        points_balance: contestation.intervention.worker.points_balance,
                        created_at: contestation.intervention.worker.created_at,

                        email: contestation.intervention.worker.user.email,
                        society: contestation.intervention.worker.user.society,
                        firstname: contestation.intervention.worker.user.firstname,
                        lastname: contestation.intervention.worker.user.lastname,
                        phone: contestation.intervention.worker.user.phone,
                    },

                    payer: {
                        id: contestation.intervention.payer.id,
                        points_balance: contestation.intervention.payer.points_balance,
                        created_at: contestation.intervention.payer.created_at,

                        email: contestation.intervention.payer.user.email,
                        society: contestation.intervention.payer.user.society,
                        firstname: contestation.intervention.payer.user.firstname,
                        lastname: contestation.intervention.payer.user.lastname,
                        phone: contestation.intervention.payer.user.phone,
                    },

                    tools: contestation.intervention.used_tools.map((tool) => ({
                        id: tool.id,
                        name: tool.name,
                        coef: tool.coef,
                        unit: tool.unit,
                        version: tool.version,
                        is_active: tool.is_active,
                    })),
                },
            };
        });

        return publicContestations;
    } catch (error) {
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "GET_CONTESTATIONS_BY_GUILD_ERROR",
            message: "Une erreur est survenue lors de la récupération des contestations de la guilde.",
        });
    }
}