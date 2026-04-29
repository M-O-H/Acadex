import {
  Injectable,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OtpService } from '../notifications/services/otp.service';
import {
  StudentRegisterDto,
  VerifyOtpDto,
  ResendOtpDto,
} from './dto/student.dto';
import { VerificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);
  private readonly otpExpiryMinutes = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
  ) {}

  async register(dto: StudentRegisterDto, photoFile: Express.Multer.File) {
    this.logger.log(`Student registration attempt: ${dto.personalEmail}`);

    if (!photoFile) {
      throw new BadRequestException('Student photo is required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.personalEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const uploadDir = join(process.cwd(), 'uploads', 'student-photos');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const photoPath = join(
      uploadDir,
      `${Date.now()}-${photoFile.originalname}`,
    );

    const temporaryPassword = this.otpService.generateOtp();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.personalEmail,
        password: hashedPassword,
        role: 'STUDENT',
        isApproved: false,
        isEmailVerified: false,
        isPhoneVerified: false,
      },
    });

    await this.prisma.studentProfile.create({
      data: {
        userId: user.id,
        fullNameAr: dto.fullNameAr,
        fullNameEn: dto.fullNameEn,
        dateOfBirth: new Date(dto.dateOfBirth),
        photoPath,
        phone: dto.phone,
        personalEmail: dto.personalEmail,
        address: dto.address,
        certificateType: dto.certificateType,
        nationality: dto.nationality,
        status: 'PENDING',
      },
    });

    await this.sendVerificationCodes(user.id, dto.personalEmail, dto.phone);

    this.logger.log(`Student registered (pending): ${dto.personalEmail}`);

    return {
      message: 'Registration submitted. Please verify your contact details.',
      email: dto.personalEmail,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { verificationCodes: true },
    });

    if (!user) {
      throw new NotFoundException('Registration not found');
    }

    const type = dto.type as unknown as VerificationType;

    const codeRecord = user.verificationCodes.find(
      (c) => c.code === dto.code && c.type === type && !c.verified,
    );

    if (!codeRecord) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (codeRecord.expiresAt < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    await this.prisma.verificationCode.update({
      where: { id: codeRecord.id },
      data: { verified: true },
    });

    if (type === VerificationType.EMAIL) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isPhoneVerified: true },
      });
    }

    this.logger.log(`Contact verified via ${dto.type}: ${dto.email}`);

    return {
      message: `${dto.type} verified successfully. Your registration is pending admin approval.`,
    };
  }

  async resendOtp(dto: ResendOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('Registration not found');
    }

    await this.prisma.verificationCode.deleteMany({
      where: {
        userId: user.id,
        verified: false,
      },
    });

    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }

    const type = dto.type as unknown as VerificationType;
    const code = this.otpService.generateOtp();

    if (type === VerificationType.EMAIL) {
      await this.otpService.sendEmail(profile.personalEmail, code);
    } else {
      await this.otpService.sendSms(profile.phone, code);
    }

    await this.prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        type,
        expiresAt: new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000),
      },
    });

    this.logger.log(`OTP resent via ${dto.type}: ${dto.email}`);

    return { message: 'Verification code sent' };
  }

  async getPendingStudents() {
    return this.prisma.studentProfile.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async approveStudent(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }

    if (profile.status === 'APPROVED') {
      throw new ConflictException('Student already approved');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
    });

    await this.prisma.studentProfile.update({
      where: { userId },
      data: { status: 'APPROVED' },
    });

    this.logger.log(`Student approved: ${userId}`);

    return { message: 'Student approved successfully' };
  }

  async rejectStudent(userId: string, reason: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }

    if (profile.status === 'REJECTED') {
      throw new ConflictException('Student already rejected');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isApproved: false },
    });

    await this.prisma.studentProfile.update({
      where: { userId },
      data: { status: 'REJECTED', rejectionReason: reason },
    });

    this.logger.log(`Student rejected: ${userId} - ${reason}`);

    return { message: 'Student rejected' };
  }

  private async sendVerificationCodes(
    userId: string,
    email: string,
    phone: string,
  ) {
    const emailCode = this.otpService.generateOtp();
    const smsCode = this.otpService.generateOtp();
    const expiry = new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000);

    await Promise.all([
      this.otpService.sendEmail(email, emailCode),
      this.otpService.sendSms(phone, smsCode),
    ]);

    await this.prisma.verificationCode.createMany({
      data: [
        {
          userId,
          code: emailCode,
          type: VerificationType.EMAIL,
          expiresAt: expiry,
        },
        {
          userId,
          code: smsCode,
          type: VerificationType.SMS,
          expiresAt: expiry,
        },
      ],
    });
  }
}
