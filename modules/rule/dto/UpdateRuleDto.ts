import { DTO, isRequired, isString } from '@/managers/DtoManager';

export class UpdateRuleDto extends DTO {
    @isRequired()
    @isString()
    content!: string;

    @isRequired()
    @isString()
    id!: string;

    @isRequired()
    @isString()
    guildName!: string;
}