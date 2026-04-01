import { UserAppData } from "./userContext.types";
import { cookies } from "next/headers";
import TokenManager from "@/managers/TokenManager";
import LogManager from "@/managers/LogManager";
import { prisma } from "@/prisma/prisma";

export async function getUserAppData(): Promise<UserAppData | null> {
    try {
        const cookieStore = await cookies();

        const accessToken = cookieStore.get("accessToken")?.value;
        console.log("[getUserAppData] accessToken exists:", !!accessToken);

        if (!accessToken) {
            console.log("[getUserAppData] no accessToken");
            return null;
        }

        let payload: any;

        try {
            payload = TokenManager.verifyAccessToken(accessToken);
            console.log("[getUserAppData] payload:", payload);
        } catch (error) {
            console.log("[getUserAppData] verifyAccessToken failed:", error);
            return null;
        }

        const accountId = payload?.accountId;
        console.log("[getUserAppData] accountId:", accountId);

        if (!accountId) {
            console.log("[getUserAppData] no accountId in payload");
            return null;
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

        console.log("[getUserAppData] user found:", !!user);

        if (!user) {
            return null;
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

        console.log("[getUserAppData] relations count:", relations.length);

        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            relations,
        };
    } catch (error) {
        console.log("[getUserAppData] unexpected error:", error);
        return null;
    }
}