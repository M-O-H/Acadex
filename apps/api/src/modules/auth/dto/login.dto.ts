import { IsEmail, IsString } from 'class-validator';
import { IsUnicodeNormalized } from '../../../common/validators/decorators';

export class LoginDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsUnicodeNormalized({ message: 'email contains invalid unicode characters' })
  email: string;

  @IsString()
  password: string;
}
