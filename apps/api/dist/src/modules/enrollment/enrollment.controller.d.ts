import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
export declare class EnrollmentController {
    private readonly enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    create(dto: CreateEnrollmentDto): Promise<{
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        enrolledAt: Date;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            firstName: string | null;
            lastName: string | null;
            role: import("@prisma/client").$Enums.Role;
            isApproved: boolean;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        course: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            code: string;
        };
    } & {
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        enrolledAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        enrolledAt: Date;
    }>;
    updateStatus(id: string, dto: UpdateEnrollmentStatusDto): Promise<{
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        enrolledAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
