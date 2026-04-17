import { DTO, isRequired, isString } from "@/managers/DtoManager";

export class CreateContestationDto extends DTO {
    @isRequired()
    @isString()
    guildName!: string;

    @isRequired()
    @isString()
    interventionId!: string;

    @isRequired()
    @isString()
    reason!: string;
}