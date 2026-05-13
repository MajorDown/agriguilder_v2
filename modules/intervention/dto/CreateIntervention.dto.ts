import { DTO, isRequired, isString, isNumber } from "@/managers/DtoManager";

export class CreateInterventionDto extends DTO {
    @isRequired()
    @isString()
    guildName!: string;

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