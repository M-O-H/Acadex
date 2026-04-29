import {
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import {
  IsSafeName,
  IsUnicodeNormalized,
} from '../../../common/validators/decorators';

export enum CertificateType {
  SUDANESE = 'SUDANESE',
  ARABIAN = 'ARABIAN',
  FOREIGN = 'FOREIGN',
}

export class StudentRegisterDto {
  @IsString()
  @IsSafeName('ARABIC')
  fullNameAr: string;

  @IsString()
  @IsSafeName('LATIN')
  fullNameEn: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  phone: string;

  @IsEmail()
  @IsUnicodeNormalized()
  personalEmail: string;

  @IsString()
  address: string;

  @IsEnum(CertificateType)
  certificateType: CertificateType;

  @IsString()
  @IsUnicodeNormalized()
  nationality: string;
}

export class VerifyOtpDto {
  @IsEmail()
  @IsUnicodeNormalized()
  email: string;

  @IsString()
  code: string;

  @IsEnum(CertificateType)
  type: CertificateType;
}

export class ResendOtpDto {
  @IsEmail()
  @IsUnicodeNormalized()
  email: string;

  @IsEnum(CertificateType)
  type: CertificateType;
}

export class ApproveStudentDto {
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectStudentDto {
  @IsString()
  reason: string;
}
