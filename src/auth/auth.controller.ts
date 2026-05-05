import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Public, CurrentUser } from './decorators';

interface JwtUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @CurrentUser() user: JwtUser,
  ): Promise<{ status: string; message: string }> {
    return this.authService.logout(user.id);
  }

  @Get('me')
  getMe(@CurrentUser() user: JwtUser): {
    status: string;
    message: string;
    user: JwtUser;
  } {
    return {
      status: 'success',
      message: 'User profile retrieved successfully.',
      user,
    };
  }
}
