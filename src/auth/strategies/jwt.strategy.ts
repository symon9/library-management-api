import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // Tells Passport where to find the token — in the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // If token is expired, reject it
      ignoreExpiration: false,

      // The same secret used to sign tokens — must match what AuthService uses
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  // This runs after the token signature is verified
  // Whatever you return here gets attached to request.user
  async validate(payload: { sub: string; email: string; role: string }) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
