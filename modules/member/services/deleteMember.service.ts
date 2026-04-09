import { prisma } from "@/prisma/prisma";
import ErrorManager from "@/managers/ErrorManager";

export async function deleteMember(memberId: string): Promise<void> {
    try {
        await prisma.member.update({
            where: {
                id: memberId,
            },
            data: {
                revoked_at: new Date(),
            }
        })
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "DELETE_MEMBER_ERROR",
            message: "Une erreur est survenue lors de la suppression du membre.",
        })
    }
}