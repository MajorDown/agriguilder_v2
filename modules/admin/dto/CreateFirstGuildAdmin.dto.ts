import { DTO, isEmail, isRequired, isString, minLength } from "@/managers/DtoManager";

export class CreateFirstGuildAdminDto extends DTO {
    @isRequired()
    @isString()
    guildId!: string;

    @isRequired()
    @isEmail()
    email!: string;

    @isRequired()
    @isString()
    @minLength(3)
    firstname!: string;

    @isRequired()
    @isString()
    @minLength(3)
    lastname!: string;

    @isRequired()
    @isString()
    phone!: string;

    @isString()
    society?: string;
}
