import { PrismaService } from '../../database/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';
export declare class EnrollmentService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: CreateEnrollmentDto): Promise<{
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
    updateStatus(id: string, data: UpdateEnrollmentStatusDto): Promise<{
        id: string;
        userId: string;
        courseId: string;
        status: import("@prisma/client").$Enums.EnrollmentStatus;
        enrolledAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
