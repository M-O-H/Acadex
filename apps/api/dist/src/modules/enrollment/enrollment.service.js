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
var EnrollmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let EnrollmentService = EnrollmentService_1 = class EnrollmentService {
    prisma;
    logger = new common_1.Logger(EnrollmentService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        this.logger.log(`Enrolling user ${data.userId} in course ${data.courseId}`);
        const existing = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId: data.userId, courseId: data.courseId },
            },
        });
        if (existing) {
            this.logger.warn(`Enrollment already exists: user ${data.userId}, course ${data.courseId}`);
            throw new common_1.ConflictException('Already enrolled');
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
    async findOne(id) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id },
        });
        if (!enrollment) {
            this.logger.warn(`Enrollment not found: ${id}`);
            throw new common_1.NotFoundException('Enrollment not found');
        }
        return enrollment;
    }
    async updateStatus(id, data) {
        this.logger.log(`Updating enrollment status: ${id} -> ${data.status}`);
        await this.findOne(id);
        const updated = await this.prisma.enrollment.update({
            where: { id },
            data: { status: data.status },
        });
        this.logger.log(`Enrollment status updated: ${id}`);
        return updated;
    }
    async remove(id) {
        this.logger.log(`Dropping enrollment: ${id}`);
        await this.findOne(id);
        await this.prisma.enrollment.delete({ where: { id } });
        this.logger.log(`Enrollment dropped: ${id}`);
    }
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = EnrollmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map