import { DTO, isRequired, isEmail, isEnum, minLength, maxLength } from '@/managers/DtoManager';
import { EmailAuthCodeContext } from '@/prisma/generated/prisma/enums';

class CheckEmailAuthCodeDto extends DTO {
    @isRequired()
    @isEmail()
    email!: string;

    @isRequired()
    @minLength(6)
    @maxLength(6)
    code!: string;

    @isRequired()
    @isEnum(EmailAuthCodeContext)
    context!: EmailAuthCodeContext;
}

export default CheckEmailAuthCodeDto;

