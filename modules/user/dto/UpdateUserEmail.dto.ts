import { DTO, isRequired, isString, minLength } from '@/managers/DtoManager';

export class UpdateUserEmailDto extends DTO {
    @isRequired()
    @isString()
    @minLength(3)
    newEmail!: string;

    @isRequired()
    @isString()
    currentPassword!: string;
}