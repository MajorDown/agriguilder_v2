import { DTO, isRequired, isString, minLength } from '@/managers/DtoManager';

export class UpdateUserPasswordDto extends DTO {
    @isRequired()
    @isString()
    @minLength(3)
    newPassword!: string;

    @isRequired()
    @isString()
    currentPassword!: string;
}