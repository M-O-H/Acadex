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
var GradesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let GradesService = GradesService_1 = class GradesService {
    prisma;
    logger = new common_1.Logger(GradesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        this.logger.log(`Creating grade for user ${data.userId}, course ${data.courseId}`);
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
    async findOne(id) {
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            this.logger.warn(`Grade not found: ${id}`);
            throw new common_1.NotFoundException('Grade not found');
        }
        return grade;
    }
    async update(id, data) {
        this.logger.log(`Updating grade: ${id}`);
        await this.findOne(id);
        const updated = await this.prisma.grade.update({ where: { id }, data });
        this.logger.log(`Grade updated: ${id}`);
        return updated;
    }
    async remove(id) {
        this.logger.log(`Deleting grade: ${id}`);
        await this.findOne(id);
        await this.prisma.grade.delete({ where: { id } });
        this.logger.log(`Grade deleted: ${id}`);
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = GradesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradesService);
//# sourceMappingURL=grades.service.js.map