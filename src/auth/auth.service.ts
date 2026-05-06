import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email is already taken
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Create the user — @BeforeInsert() on the entity hashes the password automatically
    const user = this.userRepo.create(dto);
    await this.userRepo.save(user);

    // Never return the password, even hashed
    const { password, ...result } = user as any;
    return result;
  }

  async login(dto: LoginDto) {
    // Look up user by email — explicitly select password since select: false hides it normally
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password', 'name', 'role'],
    });

    // CRITICAL: Use identical error message whether email or password is wrong
    // as this prevents attackers from knowing which field is incorrect
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Build the JWT payload — sub is the standard field for user ID
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Useful for getting the current user's full profile
  async getProfile(userId: string) {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}