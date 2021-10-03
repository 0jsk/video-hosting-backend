import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { DEFAULT_AUTH_ERROR_MESSAGE, MAIL } from 'src/shared/constants/user.strings';
import { PostgresErrorCodesEnum } from 'src/database/postgresErrorCodes.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/authentication/types/tokenPayload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

  private async passwordMatching(textPassword: string, hashedPassword: string) {
    const isMatching = await bcrypt.compare(textPassword, hashedPassword);

    if (!isMatching) {
      throw new HttpException(DEFAULT_AUTH_ERROR_MESSAGE, HttpStatus.BAD_REQUEST);
    }
  }

  public async getAuthenticatedUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    await this.passwordMatching(password, user.password);

    return user;
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);

    return `Authentication=${token};HttpOnly;Path=/;Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
    return `Authentication=;HttpOnly;Path=/;Max-Age=0`;
  }
}
