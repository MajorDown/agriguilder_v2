import { DTO, isRequired, isString} from '@/managers/DtoManager';

export class DeleteRuleDto extends DTO {
    @isRequired()
    @isString()
    id!: string;

    @isRequired()
    @isString()
    guildName!: string;
}