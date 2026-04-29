import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAttendanceDto) {
    this.logger.log(
      `Recording attendance for user ${data.userId}, course ${data.courseId}`,
    );
    const attendance = await this.prisma.attendance.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        date: new Date(data.date),
        present: data.present,
      },
    });
    this.logger.log(`Attendance recorded: ${attendance.id}`);
    return attendance;
  }

  async findAll() {
    this.logger.debug('Fetching all attendance records');
    return this.prisma.attendance.findMany({
      include: { user: true, course: true },
    });
  }

  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });
    if (!attendance) {
      this.logger.warn(`Attendance not found: ${id}`);
      throw new NotFoundException('Attendance not found');
    }
    return attendance;
  }

  async update(id: string, data: UpdateAttendanceDto) {
    this.logger.log(`Updating attendance: ${id}`);
    await this.findOne(id);
    const updated = await this.prisma.attendance.update({
      where: { id },
      data,
    });
    this.logger.log(`Attendance updated: ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting attendance: ${id}`);
    await this.findOne(id);
    await this.prisma.attendance.delete({ where: { id } });
    this.logger.log(`Attendance deleted: ${id}`);
  }
}
