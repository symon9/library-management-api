import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional() // phone is not neccessary (optional)
  phone?: string;

  @IsEnum(['basic', 'premium'])
  @IsOptional() // this defaults to 'basic' if not provided
  membershipType?: 'basic' | 'premium';
}
