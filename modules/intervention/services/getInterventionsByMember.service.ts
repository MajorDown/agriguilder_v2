import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";
import { PublicIntervention } from "../intervention.types";

export async function getInterventionsByMember(memberId: string): Promise<PublicIntervention[]> {
    try { 
        const interventions = await prisma.intervention.findMany({
            where: {
                OR: [
                    { worker_id: memberId },
                    { payer_id: memberId },
                ],
            },
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
            orderBy: [
                { day: "desc" },
                { created_at: "desc" },
            ],
        });
        const guild = await prisma.guild.findFirst({
            where: {
                id: interventions[0]?.guild_id,
            },
        });
        const publicInterventions: PublicIntervention[] = interventions.map((intervention) => {
            return {
                id: intervention.id,
                guild_id: intervention.guild_id,
                worker_id: intervention.worker_id,
                payer_id: intervention.payer_id,
                day: intervention.day,
                duration: intervention.duration,
                surface: intervention.surface,
                description: intervention.description,
                status: intervention.status,
                created_at: intervention.created_at,
                updated_at: intervention.updated_at,
                guildName: intervention.guild.name,
                // si la consultation date de plus longtemps que le délai 
                // de contestation de la guilde, alors l'intervention n'est plus contestable
                isContestable: guild?.max_contestation_delay ? 
                    (new Date().getTime() - new Date(intervention.created_at).getTime()) 
                    <= guild.max_contestation_delay * 24 * 60 * 60 * 1000 : true,
                worker: {
                    id: intervention.worker.id,
                    points_balance: intervention.worker.points_balance,
                    created_at: intervention.worker.created_at,

                    email: intervention.worker.user.email,
                    society: intervention.worker.user.society,
                    firstname: intervention.worker.user.firstname,
                    lastname: intervention.worker.user.lastname,
                    phone: intervention.worker.user.phone,
                },
                payer: {
                    id: intervention.payer.id,
                    points_balance: intervention.payer.points_balance,
                    created_at: intervention.payer.created_at,

                    email: intervention.payer.user.email,
                    society: intervention.payer.user.society,
                    firstname: intervention.payer.user.firstname,
                    lastname: intervention.payer.user.lastname,
                    phone: intervention.payer.user.phone,
                },
                tools: intervention.used_tools.map((tool) => ({
                    id: tool.id,
                    name: tool.name,
                    coef: tool.coef,
                    unit: tool.unit,
                    version: tool.version,
                    is_active: tool.is_active,
                })),
            };
        });

        return publicInterventions;
    } catch (error) {
        throw ErrorManager.throwOrCreate(error, {
            statusCode: 500,
            code: "GET_INTERVENTIONS_BY_MEMBER_ERROR",
            message: "Une erreur est survenue lors de la récupération des interventions du membre.",
        });
    }
}