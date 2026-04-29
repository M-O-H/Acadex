import { PrismaService } from '../../database/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
export declare class AttendanceService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: CreateAttendanceDto): Promise<{
        id: string;
        userId: string;
        courseId: string;
        date: Date;
        present: boolean;
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
        date: Date;
        present: boolean;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        courseId: string;
        date: Date;
        present: boolean;
    }>;
    update(id: string, data: UpdateAttendanceDto): Promise<{
        id: string;
        userId: string;
        courseId: string;
        date: Date;
        present: boolean;
    }>;
    remove(id: string): Promise<void>;
}
