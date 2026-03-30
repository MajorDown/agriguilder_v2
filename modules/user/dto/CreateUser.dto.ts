import { DTO, isRequired, isEmail, isEnum, isString, minLength } from '@/managers/DtoManager';
import type { UserCreationContext } from '../user.types';

export class CreateUserDto extends DTO {
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
    @minLength(10)
    password?: string;

    @isString()
    society?: string;

    @isEnum(['byAdmin', 'selfSignUp'])
    context!: UserCreationContext;
}