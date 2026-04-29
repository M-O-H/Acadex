import { PrismaService } from '../../database/prisma.service';
import { Role } from '@prisma/client';
export interface CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    isApproved?: boolean;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
}
export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    role?: Role;
}
export declare class UsersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: CreateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
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
    } | null>;
    update(id: string, data: UpdateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
