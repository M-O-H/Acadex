import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto) {
    this.logger.log(`Creating course: ${data.code}`);
    const course = await this.prisma.course.create({ data });
    this.logger.log(`Course created: ${data.code}`);
    return course;
  }

  async findAll() {
    this.logger.debug('Fetching all courses');
    return this.prisma.course.findMany();
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      this.logger.warn(`Course not found: ${id}`);
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async update(id: string, data: UpdateCourseDto) {
    this.logger.log(`Updating course: ${id}`);
    await this.findOne(id);
    const updated = await this.prisma.course.update({ where: { id }, data });
    this.logger.log(`Course updated: ${id}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.log(`Deleting course: ${id}`);
    await this.findOne(id);
    await this.prisma.course.delete({ where: { id } });
    this.logger.log(`Course deleted: ${id}`);
  }
}
