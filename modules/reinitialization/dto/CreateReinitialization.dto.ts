import { DTO, isBoolean, isNumber, isRequired, isString, range } from "@/managers/DtoManager";

export class CreateReinitializationDto extends DTO {
    @isRequired()
    @isString()
    guildName!: string;

    @isRequired()
    @isString()
    nextGuildName!: string;

    @isRequired()
    @isString()
    city!: string;

    @isRequired()
    @isString()
    department!: string;

    @isRequired()
    @isNumber()
    @range(0, 1000000)
    humanHourPointValue!: number;

    @isRequired()
    @isNumber()
    @range(0, 3650)
    maxDeclarationDelay!: number;

    @isRequired()
    @isNumber()
    @range(0, 3650)
    maxValidationDelay!: number;

    @isRequired()
    @isNumber()
    @range(0, 3650)
    maxContestationDelay!: number;

    @isRequired()
    @isNumber()
    @range(0, 1000000)
    pointEuroValue!: number;

    @isRequired()
    @isBoolean()
    confirm!: boolean;
}
