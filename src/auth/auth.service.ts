import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { RegisterDto, LoginDto } from './dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { name, email, password } = registerDto;

    // Check for existing email
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(
        'An account with this email address already exists.',
      );
    }

    const user = this.userRepository.create({
      name,
      email,
      password,
      role: UserRole.MEMBER,
    });

    const savedUser = await this.userRepository.save(user);

    const tokens = await this.generateAndPersistTokens(savedUser);

    return {
      status: 'success',
      message: 'User registered successfully.',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Always fetch with password (column is select: false)
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'isActive',
        'refreshTokenHash',
      ],
    });

    // Generic 401 — never reveal which field failed
    if (!user) {
      throw new UnauthorizedException(
        'Authentication failed: Invalid credentials provided.',
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Authentication failed: Invalid credentials provided.',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Access denied: This account has been deactivated.',
      );
    }

    const tokens = await this.generateAndPersistTokens(user);

    return {
      status: 'success',
      message: 'Authentication successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokens,
    };
  }

  async logout(userId: number): Promise<{ status: string; message: string }> {
    if (!userId) {
      throw new UnauthorizedException(
        'Logout failed: Invalid session context.',
      );
    }
    try {
      await this.userRepository.update(userId, { refreshTokenHash: null });
      return {
        status: 'success',
        message: 'User session has been terminated successfully.',
      };
    } catch (error) {
      console.error('Logout error for user', userId, error);
      throw error;
    }
  }

  async generateAndPersistTokens(user: User): Promise<AuthTokens> {
    const tokens = await this.generateTokens(user);

    // Store hashed refresh token
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.update(user.id, {
      refreshTokenHash: hashedRefresh,
    });

    return tokens;
  }

  async generateTokens(user: User): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
