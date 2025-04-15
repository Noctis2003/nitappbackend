import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty() // Correct usage of IsNotEmpty
  @IsEmail()
  email: string;

  @IsNotEmpty() // Correct usage of IsNotEmpty
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty() // Correct usage of IsNotEmpty
  @IsString()
  username: string;
}
