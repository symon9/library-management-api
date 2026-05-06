import { IsEmail, IsString, MinLength, IsNotEmpty} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6) //password must be at least 6 character!!!
  password: string;
}
