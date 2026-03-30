import { DTO, isRequired, isEmail, isEnum } from '@/managers/DtoManager';
import { EmailAuthCodeContext } from '@/prisma/generated/prisma/enums';

class CreateEmailAuthCodeDto extends DTO {
    @isRequired()
    @isEmail()
    email!: string;

    @isRequired()
    @isEnum(EmailAuthCodeContext)
    context!: EmailAuthCodeContext;
}

export default CreateEmailAuthCodeDto;