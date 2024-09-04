import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  userId: number;

  @IsString()
  username: string;

  @IsEmail()
  email: string;
}
