import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import PasswordManager from "@/managers/PasswordManager";
import LogManager from "@/managers/LogManager";

export async function GET() {
    try {
        const [userCount, guildCount] = await Promise.all([
            prisma.user.count(),
            prisma.guild.count(),
        ]);
        if (userCount > 0 || guildCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Bootstrap ignoré : la base contient déjà des utilisateurs ou des guildes.",
                },
                { status: 409 }
            );
        }
        const bootstrapPassword = process.env.BOOTSTRAP_USER_PASSWORD;
        if (!bootstrapPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "BOOTSTRAP_USER_PASSWORD est manquant dans les variables d'environnement.",
                },
                { status: 500 }
            );
        }
        const passwordHash = await PasswordManager.hash(bootstrapPassword);
        const result = await prisma.$transaction(async (tx) => {
            const guild = await tx.guild.create({
                data: {
                    name: "GuilderCompany",
                    city: "Bournezeau",
                    department: "85",
                    human_hour_point_value: 1,
                    max_declaration_delay: 7,
                    max_validation_delay: 2,
                },
            });
            const user = await tx.user.create({
                data: {
                    firstname: "Romain",
                    lastname: "Fouillaron",
                    email: "romain.fouillaron@gmx.fr",
                    phone: "0769140628",
                    password_hash: passwordHash,
                },
            });
            const member = await tx.member.create({
                data: {
                    guild_id: guild.id,
                    user_id: user.id,
                },
            });
            const admin = await tx.admin.create({
                data: {
                    guild_id: guild.id,
                    user_id: user.id,
                },
            });
            const [tool1, tool2] = await Promise.all([
                tx.tool.create({
                    data: {
                        guild_id: guild.id,
                        admin_id: admin.id,
                        name: "Gros Tracteur",
                        coef: 1.5,
                    },
                }),
                tx.tool.create({
                    data: {
                        guild_id: guild.id,
                        admin_id: admin.id,
                        name: "Petit tracteur",
                        coef: 1.2,
                    },
                }),
            ]);
            return {
                guild,
                user,
                member,
                admin,
                tools: [tool1, tool2],
            };
        });
        return NextResponse.json(
            {
                success: true,
                message: "Bootstrap effectué avec succès.",
                data: {
                    guild: {
                        id: result.guild.id,
                        name: result.guild.name,
                    },
                    user: {
                        id: result.user.id,
                        firstname: result.user.firstname,
                        lastname: result.user.lastname,
                        email: result.user.email,
                    },
                    tools: result.tools.map((tool) => ({
                        id: tool.id,
                        name: tool.name,
                        coef: tool.coef,
                    })),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        LogManager.error("Échec du bootstrap initial");
        return NextResponse.json(
            {
                success: false,
                message: "Une erreur est survenue lors du bootstrap.",
            },
            { status: 500 }
        );
    }
}