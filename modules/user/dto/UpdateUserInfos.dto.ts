import { DTO, isRequired, isString, minLength } from '@/managers/DtoManager';

export class UpdateUserInfosDto extends DTO {
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