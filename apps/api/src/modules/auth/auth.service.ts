import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponse> {
    this.logger.log(`Register attempt: ${data.email}`);

    const existing = await this.usersService.findByEmail(data.email);

    if (existing) {
      this.logger.warn(`Registration failed - email exists: ${data.email}`);
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersService.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const token = this.generateToken(user.id, user.email, user.role);

    this.logger.log(`User registered: ${data.email}`);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    this.logger.log(`Login attempt: ${data.email}`);

    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      this.logger.warn(`Login failed - user not found: ${data.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role === 'STUDENT' && !user.isApproved) {
      this.logger.warn(`Login failed - student not approved: ${data.email}`);
      throw new ForbiddenException('Account pending admin approval');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed - invalid password: ${data.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    this.logger.log(`User logged in: ${data.email}`);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }
}
