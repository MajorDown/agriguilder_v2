import { DTO, isRequired, isString } from '@/managers/DtoManager';

export class DeleteToolDto extends DTO {
    @isRequired()
    @isString()
    id!: string;

    @isRequired()
    @isString()
    guildName!: string;
}