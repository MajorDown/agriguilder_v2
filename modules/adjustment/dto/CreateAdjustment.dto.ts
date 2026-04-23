import { DTO, isEnum, isNumber, isRequired, isString } from "@/managers/DtoManager";
import { AdjustmentType } from "@/prisma/generated/prisma/browser";

export class CreateAdjustmentDto extends DTO {
    @isRequired()
    @isString()
    guildName!: string;

    @isRequired()
    @isString()
    memberId!: string;

    @isRequired()
    @isNumber()
    amount!: number;

    @isRequired()
    @isString()
    reason!: string;

    @isRequired()
    @isEnum(["INITIALISATION", "CORRECTION"])
    type!: AdjustmentType;
}