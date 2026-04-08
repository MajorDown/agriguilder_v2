import { DTO, isRequired, isString, isBoolean } from '@/managers/DtoManager';

export class ToggleToolDto extends DTO {
    @isRequired()
    @isString()
    id!: string;

    @isRequired()
    @isString()
    guildName!: string;

    @isRequired()
    @isBoolean()
    isActive!: boolean;
}