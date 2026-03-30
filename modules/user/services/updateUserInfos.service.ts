import { prisma } from "@/prisma/prisma";
import { UpdateUserInfosInput } from "../user.types";
import ErrorManager from "@/managers/ErrorManager";

export async function updateUserInfos(input: UpdateUserInfosInput): Promise<void> {
    try {
        await prisma.user.update({
            where: { id: input.id },
            data: {
                firstname: input.firstname,
                lastname: input.lastname,
                phone: input.phone,
                society: input.society,
            },
        });
    }
    catch (error) {
        throw ErrorManager.create({
            statusCode: 500,
            code: "UPDATE_USER_INFOS_FAILED",
            message: "Echec de la mise à jour des informations de l'utilisateur",
        });
    }

}