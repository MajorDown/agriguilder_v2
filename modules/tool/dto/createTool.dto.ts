import { DTO, isRequired, isString, isNumber, isEnum } from '@/managers/DtoManager';
import { ToolUnit } from '@/prisma/generated/prisma/browser';

export class CreateToolDto extends DTO {
    @isRequired()
    @isString()
    name!: string;

    @isRequired()
    @isNumber()
    coef!: number;

    @isRequired()
    @isEnum(ToolUnit)
    unit!: ToolUnit;

    @isRequired()
    @isString()
    guildName!: string;
}