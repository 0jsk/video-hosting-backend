import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Requires for authenticated requests
 */
@Injectable()
export class JwtAuthenticationGuard extends AuthGuard('jwt') {}
