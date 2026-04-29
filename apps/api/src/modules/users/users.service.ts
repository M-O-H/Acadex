import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
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

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    this.logger.log(`Creating user: ${data.email}`);

    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      this.logger.warn(`User already exists: ${data.email}`);
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'STUDENT',
      },
    });

    this.logger.log(`User created: ${data.email}`);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async findAll() {
    this.logger.log('Fetching all users');
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    this.logger.debug(`Finding user: ${id}`);

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      this.logger.warn(`User not found: ${id}`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    this.logger.log(`Updating user: ${id}`);

    await this.findOne(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User updated: ${id}`);

    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting user: ${id}`);

    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`User deleted: ${id}`);
  }
}
