import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  // role is accepted but intentionally ignored — always assigned 'member'
  @IsOptional()
  @IsString()
  role?: string;
}
