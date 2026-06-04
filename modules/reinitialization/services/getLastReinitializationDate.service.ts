import { prisma } from "@/prisma/prisma";

export async function getLastReinitializationDate(guildId: string): Promise<Date | null> {
    const lastReinitialization = await prisma.reinitialization.findFirst({
        where: {
            guild_id: guildId,
        },
        orderBy: {
            created_at: "desc",
        },
        select: {
            created_at: true,
        },
    });

    return lastReinitialization?.created_at ?? null;
}
