import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment-status.dto';

@Injectable()
export class EnrollmentService {
  private readonly logger = new Logger(EnrollmentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEnrollmentDto) {
    this.logger.log(`Enrolling user ${data.userId} in course ${data.courseId}`);

    const existing = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: data.userId, courseId: data.courseId },
      },
    });

    if (existing) {
      this.logger.warn(
        `Enrollment already exists: user ${data.userId}, course ${data.courseId}`,
      );
      throw new ConflictException('Already enrolled');
    }

    const enrollment = await this.prisma.enrollment.create({ data });
    this.logger.log(`User enrolled: ${data.userId}`);

    return enrollment;
  }

  async findAll() {
    this.logger.debug('Fetching all enrollments');
    return this.prisma.enrollment.findMany({
      include: { user: true, course: true },
    });
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });
    if (!enrollment) {
      this.logger.warn(`Enrollment not found: ${id}`);
      throw new NotFoundException('Enrollment not found');
    }
    return enrollment;
  }

  async updateStatus(id: string, data: UpdateEnrollmentStatusDto) {
    this.logger.log(`Updating enrollment status: ${id} -> ${data.status}`);
    await this.findOne(id);
    const updated = await this.prisma.enrollment.update({
      where: { id },
      data: { status: data.status },
    });
    this.logger.log(`Enrollment status updated: ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Dropping enrollment: ${id}`);
    await this.findOne(id);
    await this.prisma.enrollment.delete({ where: { id } });
    this.logger.log(`Enrollment dropped: ${id}`);
  }
}
