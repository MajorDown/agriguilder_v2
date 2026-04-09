import { DTO, isRequired, isString, isEmail } from "@/managers/DtoManager";

export class DeleteMemberDto extends DTO {
    @isRequired()
    @isString()
    memberId!: string;

    @isRequired()
    @isString()
    guildName!: string;
}