import { DTO, isRequired, isString, isEmail } from "@/managers/DtoManager";

export class CreateMemberDto extends DTO {
    @isRequired()
    @isEmail()
    email!: string;

    @isRequired()
    @isString()
    guildName!: string;

    @isRequired()
    @isString()
    firstname!: string;

    @isRequired()
    @isString()
    lastname!: string;

    @isRequired()
    @isString()
    phone!: string;

    @isString()
    society?: string;
}