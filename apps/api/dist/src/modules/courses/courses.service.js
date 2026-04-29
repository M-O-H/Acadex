"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CoursesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CoursesService = CoursesService_1 = class CoursesService {
    prisma;
    logger = new common_1.Logger(CoursesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        this.logger.log(`Creating course: ${data.code}`);
        const course = await this.prisma.course.create({ data });
        this.logger.log(`Course created: ${data.code}`);
        return course;
    }
    async findAll() {
        this.logger.debug('Fetching all courses');
        return this.prisma.course.findMany();
    }
    async findOne(id) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) {
            this.logger.warn(`Course not found: ${id}`);
            throw new common_1.NotFoundException('Course not found');
        }
        return course;
    }
    async update(id, data) {
        this.logger.log(`Updating course: ${id}`);
        await this.findOne(id);
        const updated = await this.prisma.course.update({ where: { id }, data });
        this.logger.log(`Course updated: ${id}`);
        return updated;
    }
    async remove(id) {
        this.logger.log(`Deleting course: ${id}`);
        await this.findOne(id);
        await this.prisma.course.delete({ where: { id } });
        this.logger.log(`Course deleted: ${id}`);
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = CoursesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map