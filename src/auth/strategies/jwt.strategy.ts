import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user.entity';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(payload: JwtPayload) {
    // Access tokens should remain valid for their lifetime unless the account
    // itself is no longer allowed to authenticate.
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ['id', 'name', 'email', 'role', 'isActive'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Authentication failed: Session invalid or account deactivated',
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
