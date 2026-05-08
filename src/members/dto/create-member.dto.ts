import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { MembershipType } from '../member.entity';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsEnum(MembershipType)
  @IsOptional()
  membershipType?: MembershipType;
}
