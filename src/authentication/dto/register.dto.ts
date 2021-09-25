import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { MAIL, PASSWORD, USERNAME } from 'src/authentication/strings.constants';
import { passwordRegex, validateLength } from 'src/users/dto/validators';
import { Match } from 'src/decorators/validators';

export class RegisterDto {
  @IsNotEmpty({ message: USERNAME.NOT_PRESENT })
  @Length(2, 20, {
    message: validateLength(USERNAME.TOO_SHORT, USERNAME.TOO_LONG),
  })
  nickname: string;

  @IsNotEmpty({ message: MAIL.NOT_PRESENT })
  @IsEmail(undefined, { message: MAIL.INVALID })
  email: string;

  @Matches(passwordRegex, { message: PASSWORD.TOO_WEAK })
  @Length(4, 20, {
    message: validateLength(PASSWORD.TOO_SHORT, PASSWORD.TOO_LONG),
  })
  password: string;

  @Match('password', { message: PASSWORD.CONFIRM })
  passwordConfirm: string;
}
