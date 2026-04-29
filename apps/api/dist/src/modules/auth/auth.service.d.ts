import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
    };
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(data: RegisterDto): Promise<AuthResponse>;
    login(data: LoginDto): Promise<AuthResponse>;
    private generateToken;
    validateUser(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
