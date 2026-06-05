import { DTO, isEmail, isRequired, isString } from "@/managers/DtoManager";

export class CheckAdminByEmailDto extends DTO {
    @isRequired()
    @isEmail()
    email!: string;

    @isRequired()
    @isString()
    guildName!: string;
}
