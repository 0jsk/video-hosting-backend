import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { LocalAuthenticationGuard } from 'src/authentication/guards/LocalAuthentication.guard';
import { RequestWithUser } from 'src/authentication/types/RequestWithUser.interface';
import { JwtAuthenticationGuard } from 'src/authentication/guards/jwt-authentication.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return await this.authenticationService.register(registrationData);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Post('log-in')
  @UseGuards(LocalAuthenticationGuard)
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);

    request.res.setHeader('Set-Cookie', cookie);

    return user;
  }

  @Post('log-out')
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: RequestWithUser) {
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  }
}
