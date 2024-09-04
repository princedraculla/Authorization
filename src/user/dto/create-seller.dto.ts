import {
  IsString,
  IsBoolean,
  IsObject,
  IsNumber,
  IsEmail,
} from 'class-validator';

export class CreateSellerDTO {
  @IsNumber()
  userId: number;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isAdmin?: boolean;

  @IsBoolean()
  seller?: boolean = true;

  @IsObject()
  permissions?: {
    action: [string];
    subject: string;
    condition?: object;
  };
}
