import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import {
  IsStrongPassword,
  IsUnicodeNormalized,
} from '../../../common/validators/decorators';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsUnicodeNormalized({ message: 'email contains invalid unicode characters' })
  email: string;

  @IsString()
  @IsStrongPassword({
    message:
      'password must be at least 8 characters with uppercase, lowercase, number, and special character',
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

  @IsOptional()
  @IsEnum(Role, { message: 'role must be ADMIN, TEACHER, or STUDENT' })
  role?: Role;
}
