import { DTO, isRequired, isString, isNumber } from '@/managers/DtoManager';

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
}