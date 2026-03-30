import {DTO, isEmail, isString, minLength} from '@/managers/DtoManager';

class CreateSessionDto extends DTO {
    @isEmail()
    email!: string;

    @isString()
    @minLength(8)
    password!: string;
}

export default CreateSessionDto;