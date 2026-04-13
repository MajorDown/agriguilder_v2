import { DTO, isRequired, isString } from '@/managers/DtoManager';

export class CreateRuleDto extends DTO {
    @isRequired()
    @isString()
    content!: string;

    @isRequired()
    @isString()
    guildName!: string;
}