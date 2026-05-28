import { DTO, isRequired, isString, isNumber, isEnum } from "@/managers/DtoManager";
import { ContestationStatus } from "@/prisma/generated/prisma/enums";

export class ResolveContestationDto extends DTO {
    @isRequired()
    @isString()
    contestationId!: string;

    @isRequired()
    @isString()
    guildName!: string;

    @isRequired()
    @isEnum(ContestationStatus)
    status!: ContestationStatus;

    @isRequired()
    @isString()
    payerId!: string;

    @isRequired()
    @isString()
    day!: string;

    @isRequired()
    @isNumber()
    duration!: number;

    @isNumber()
    surface!: number;

    @isRequired()
    tools!: string[];

    @isString()
    description?: string | null;
}