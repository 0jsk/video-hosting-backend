import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { DEFAULT_AUTH_ERROR_MESSAGE, MAIL } from 'src/authentication/strings.constants';
import { PostgresErrorCodesEnum } from 'src/database/postgresErrorCodes.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    try {
      return await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === PostgresErrorCodesEnum.UniqueViolation) {
        throw new HttpException(MAIL.ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(DEFAULT_AUTH_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async isPasswordMatching(textPassword: string, hashedPassword: string) {
    const isMatching = await bcrypt.compare(textPassword, hashedPassword);

    if (!isMatching) {
      throw new HttpException(DEFAULT_AUTH_ERROR_MESSAGE, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAuthenticatedUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    await this.isPasswordMatching(user.password, password);

    return user;
  }
}
