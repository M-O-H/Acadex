import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
export declare class GradesController {
    private readonly gradesService;
    constructor(gradesService: GradesService);
    create(dto: CreateGradeDto): Promise<{
        id: string;
        userId: string;
        courseId: string;
        value: number;
        maxValue: number;
        gradedAt: Date;
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
        value: number;
        maxValue: number;
        gradedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        courseId: string;
        value: number;
        maxValue: number;
        gradedAt: Date;
    }>;
    update(id: string, dto: UpdateGradeDto): Promise<{
        id: string;
        userId: string;
        courseId: string;
        value: number;
        maxValue: number;
        gradedAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
