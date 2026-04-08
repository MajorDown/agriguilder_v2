import { prisma } from "@/prisma/prisma";
import { PublicMember } from "../member.types";
import ErrorManager from "@/managers/ErrorManager";

/**
 * @description Récupère la liste des membres d'une guilde à partir de son nom.
 * @param {string} guildName - Le nom de la guilde dont on veut récupérer les membres.
 * @return {Promise<PublicMember[]>} Une promesse qui résout un tableau de membres publics.
 */
export async function getMembersByGuild(guildName: string): Promise<PublicMember[]> {
    try {
        const guildId = await prisma.guild.findFirst({
            where: { name: guildName },
            select: { id: true }
        });
        const members = await prisma.member.findMany({
            where: { 
                guild_id: guildId?.id,
                revoked_at: null
            },
            include: {
                user: {
                    select: {
                        society: true,
                        lastname: true,
                        firstname: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        });
        const publicMembers: PublicMember[] = members.map(member => ({
            id: member.id,
            society: member.user.society,
            lastname: member.user.lastname,
            firstname: member.user.firstname,
            email: member.user.email,
            phone: member.user.phone,
            points_balance: member.points_balance,
            created_at: member.created_at
        }));
        return publicMembers;
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "GET_MEMBERS_BY_GUILD_ERROR",
            message: "Echec de la récupération des membres de la guilde."
        })
    }
}