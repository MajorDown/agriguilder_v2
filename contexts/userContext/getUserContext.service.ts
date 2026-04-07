import { UserAppData } from "./userContext.types";
import { cookies } from "next/headers";
import TokenManager from "@/managers/TokenManager";
import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";

export async function getUserAppData(): Promise<UserAppData> {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        throw ErrorManager.create({
            statusCode: 401,
            code: "ACCESS_TOKEN_MISSING",
            message: "Access token manquant."
        });
    }

    let payload: any;

    try {
        payload = TokenManager.verifyAccessToken(accessToken);
    } catch {
        throw ErrorManager.create({
            statusCode: 401,
            code: "ACCESS_TOKEN_INVALID",
            message: "Access token invalide ou expiré."
        });
    }

    const accountId = payload?.accountId;

    if (!accountId) {
        throw ErrorManager.create({
            statusCode: 401,
            code: "ACCESS_TOKEN_INVALID",
            message: "Payload du token invalide."
        });
    }

    const user = await prisma.user.findUnique({
        where: { id: accountId },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
        }
    });

    if (!user) {
        throw ErrorManager.create({
            statusCode: 404,
            code: "USER_NOT_FOUND",
            message: "Utilisateur introuvable."
        });
    }

    const [members, admins, employees] = await Promise.all([
        prisma.member.findMany({
            where: { user_id: accountId },
            select: {
                guild: { select: { id: true, name: true } },
                created_at: true,
            }
        }),
        prisma.admin.findMany({
            where: { user_id: accountId },
            select: {
                guild: { select: { id: true, name: true } },
                created_at: true,
            }
        }),
        prisma.employee.findMany({
            where: { user_id: accountId },
            select: {
                guild: { select: { id: true, name: true } },
                created_at: true,
            }
        }),
    ]);

    const relations = [
        ...members.map(member => ({
            guildId: member.guild.id,
            guildName: member.guild.name,
            sinceAt: member.created_at.toISOString(),
            role: "membre" as const,
        })),
        ...admins.map(admin => ({
            guildId: admin.guild.id,
            guildName: admin.guild.name,
            sinceAt: admin.created_at.toISOString(),
            role: "admin" as const,
        })),
        ...employees.map(employee => ({
            guildId: employee.guild.id,
            guildName: employee.guild.name,
            sinceAt: employee.created_at.toISOString(),
            role: "employé" as const,
        })),
    ];

    return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        relations,
    };
}