import { DTO, isRequired, isString, isNumber } from "@/managers/DtoManager";

export class CreateGuildDto extends DTO {
    @isRequired()
    @isString()
    name!: string;

    @isRequired()
    @isString()
    city!: string;
    department!: string;

    @isRequired()
    @isNumber()
    humanHourPointValue!: number;

    @isRequired()
    @isNumber()
    maxDeclarationDelay!: number;

    @isRequired()
    @isNumber()
    maxContestationDelay!: number;

}