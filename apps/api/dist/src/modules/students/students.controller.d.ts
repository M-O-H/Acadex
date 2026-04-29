import { StudentsService } from './students.service';
import { StudentRegisterDto, VerifyOtpDto, ResendOtpDto, RejectStudentDto } from './dto/student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
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
    getPending(): Promise<({
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
    approve(userId: string): Promise<{
        message: string;
    }>;
    reject(userId: string, dto: RejectStudentDto): Promise<{
        message: string;
    }>;
}
