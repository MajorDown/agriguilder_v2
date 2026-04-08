import { DTO, isRequired, isString, isEmail } from '@/managers/DtoManager';

export class CheckMemberByEmailDto extends DTO {
    @isRequired()
    @isEmail()
    email!: string;

    @isRequired()
    @isString()
    guildName!: string;
}