import { DTO, isRequired, isString, isNumber, isEnum } from '@/managers/DtoManager';
import { ToolUnit } from '@/prisma/generated/prisma/client';

export class UpdateToolDto extends DTO {
    @isRequired()
    @isString()
    name!: string;

    @isRequired()
    @isNumber()
    coef!: number;

    @isRequired()
    @isString()
    id!: string;

    @isRequired()
    @isString()
    guildName!: string;

    @isRequired()
    @isEnum(ToolUnit)
    unit?: ToolUnit;
}