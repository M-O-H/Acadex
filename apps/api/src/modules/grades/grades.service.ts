import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  private readonly logger = new Logger(GradesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGradeDto) {
    this.logger.log(
      `Creating grade for user ${data.userId}, course ${data.courseId}`,
    );
    const grade = await this.prisma.grade.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        value: data.value,
        maxValue: data.maxValue || 100,
      },
    });
    this.logger.log(`Grade created: ${grade.id}`);
    return grade;
  }

  async findAll() {
    this.logger.debug('Fetching all grades');
    return this.prisma.grade.findMany({
      include: { user: true, course: true },
    });
  }

  async findOne(id: string) {
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) {
      this.logger.warn(`Grade not found: ${id}`);
      throw new NotFoundException('Grade not found');
    }
    return grade;
  }

  async update(id: string, data: UpdateGradeDto) {
    this.logger.log(`Updating grade: ${id}`);
    await this.findOne(id);
    const updated = await this.prisma.grade.update({ where: { id }, data });
    this.logger.log(`Grade updated: ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting grade: ${id}`);
    await this.findOne(id);
    await this.prisma.grade.delete({ where: { id } });
    this.logger.log(`Grade deleted: ${id}`);
  }
}
