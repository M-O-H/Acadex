import { IsEmail, IsString } from 'class-validator';
import {
  IsStrongPassword,
  IsUnicodeNormalized,
} from '../../../common/validators/decorators';

export class RegisterDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsUnicodeNormalized({ message: 'email contains invalid unicode characters' })
  email: string;

  @IsString()
  @IsStrongPassword({
    message:
      'password must be at least 12 characters with uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsString()
  @IsUnicodeNormalized({
    message: 'firstName contains invalid unicode characters',
  })
  firstName: string;

  @IsString()
  @IsUnicodeNormalized({
    message: 'lastName contains invalid unicode characters',
  })
  lastName: string;
}
