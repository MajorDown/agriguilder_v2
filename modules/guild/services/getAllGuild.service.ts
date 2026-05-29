import { prisma } from '@/prisma/prisma';
import ErrorManager from '@/managers/ErrorManager';
import { PublicGuildWithData } from '../guild.types';

/**
 * @description Récupère toutes les guildes
 * @return La liste des guildes avec leur data respectives
 */
export async function getAllGuild(): Promise<PublicGuildWithData[]> {
    try {
        const guilds = await prisma.guild.findMany({
            select: {
                id: true,
                name: true,
                city: true,
                department: true,
                created_at: true,
                updated_at: true,
                subscriptions: {
                    select: {
                        package: true,
                        created_at: true,
                        ends_at: true,
                        revoked_at: true,
                    },
                },
                members: {
                    select: {
                        user: {
                            select: {
                                firstname: true,
                                lastname: true,
                                email: true,
                                phone: true,
                            }
                        },
                        revoked_at: true,
                    }
                },
                admins: {
                    select: {
                        user: {
                            select: {
                                firstname: true,
                                lastname: true,
                                email: true,
                                phone: true,
                            }
                        },
                        revoked_at: true,
                    }
                },
                tools: {
                    select: {
                        name: true,
                        unit: true,
                        coef: true,
                        version: true,
                        is_active: true,
                    }
                },
                rules: {
                    select: {
                        content: true,
                        created_at: true,
                    }
                },
                reinitializations: {
                    select: {
                        point_euro_value: true,
                        created_at: true,
                        admin_id: true,
                    }
                }
            }
        }
        );
        return guilds.map(guild => ({
            ...guild,
            tools: guild.tools.map(tool => ({
                ...tool,
                version: tool.version.toString(),
                unit: tool.unit.toString(),
            }))
        }));
    } catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "GET_ALL_GUILDS_FAILED",
            message: "Echec de la récupération des guildes",
        });
    }
}