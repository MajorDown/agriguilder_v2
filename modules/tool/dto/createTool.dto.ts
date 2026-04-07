import { DTO, isRequired, isString, isNumber } from '@/managers/DtoManager';

export class CreateToolDto extends DTO {
    @isRequired()
    @isString()
    name!: string;

    @isRequired()
    @isNumber()
    coef!: number;

    @isRequired()
    @isString()
    guildName!: string;

    @isRequired()
    @isString()
    adminId!: string;
}