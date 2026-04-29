import { PrismaService } from '../../database/prisma.service';
import { OtpService } from '../notifications/services/otp.service';
import { StudentRegisterDto, VerifyOtpDto, ResendOtpDto } from './dto/student.dto';
export declare class StudentsService {
    private readonly prisma;
    private readonly otpService;
    private readonly logger;
    private readonly otpExpiryMinutes;
    constructor(prisma: PrismaService, otpService: OtpService);
    register(dto: StudentRegisterDto, photoFile: Express.Multer.File): Promise<{
        message: string;
        email: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    resendOtp(dto: ResendOtpDto): Promise<{
        message: string;
    }>;
    getPendingStudents(): Promise<({
        user: {
            id: string;
            email: string;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.StudentStatus;
        fullNameAr: string;
        fullNameEn: string;
        dateOfBirth: Date;
        phone: string;
        personalEmail: string;
        address: string;
        certificateType: import("@prisma/client").$Enums.CertificateType;
        nationality: string;
        photoPath: string | null;
        rejectionReason: string | null;
    })[]>;
    approveStudent(userId: string): Promise<{
        message: string;
    }>;
    rejectStudent(userId: string, reason: string): Promise<{
        message: string;
    }>;
    private sendVerificationCodes;
}
