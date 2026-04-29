"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StudentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const otp_service_1 = require("../notifications/services/otp.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const path_1 = require("path");
const fs_1 = require("fs");
let StudentsService = StudentsService_1 = class StudentsService {
    prisma;
    otpService;
    logger = new common_1.Logger(StudentsService_1.name);
    otpExpiryMinutes = 10;
    constructor(prisma, otpService) {
        this.prisma = prisma;
        this.otpService = otpService;
    }
    async register(dto, photoFile) {
        this.logger.log(`Student registration attempt: ${dto.personalEmail}`);
        if (!photoFile) {
            throw new common_1.BadRequestException('Student photo is required');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.personalEmail },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const uploadDir = (0, path_1.join)(process.cwd(), 'uploads', 'student-photos');
        if (!(0, fs_1.existsSync)(uploadDir)) {
            (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
        }
        const photoPath = (0, path_1.join)(uploadDir, `${Date.now()}-${photoFile.originalname}`);
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
    async verifyOtp(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { verificationCodes: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Registration not found');
        }
        const type = dto.type;
        const codeRecord = user.verificationCodes.find((c) => c.code === dto.code && c.type === type && !c.verified);
        if (!codeRecord) {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
        if (codeRecord.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Verification code has expired');
        }
        await this.prisma.verificationCode.update({
            where: { id: codeRecord.id },
            data: { verified: true },
        });
        if (type === client_1.VerificationType.EMAIL) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: { isEmailVerified: true },
            });
        }
        else {
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
    async resendOtp(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.NotFoundException('Registration not found');
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
            throw new common_1.NotFoundException('Student profile not found');
        }
        const type = dto.type;
        const code = this.otpService.generateOtp();
        if (type === client_1.VerificationType.EMAIL) {
            await this.otpService.sendEmail(profile.personalEmail, code);
        }
        else {
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
    async approveStudent(userId) {
        const profile = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        if (profile.status === 'APPROVED') {
            throw new common_1.ConflictException('Student already approved');
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
    async rejectStudent(userId, reason) {
        const profile = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        if (profile.status === 'REJECTED') {
            throw new common_1.ConflictException('Student already rejected');
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
    async sendVerificationCodes(userId, email, phone) {
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
                    type: client_1.VerificationType.EMAIL,
                    expiresAt: expiry,
                },
                {
                    userId,
                    code: smsCode,
                    type: client_1.VerificationType.SMS,
                    expiresAt: expiry,
                },
            ],
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = StudentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        otp_service_1.OtpService])
], StudentsService);
//# sourceMappingURL=students.service.js.map