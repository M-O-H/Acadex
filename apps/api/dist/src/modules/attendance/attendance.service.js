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
var AttendanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AttendanceService = AttendanceService_1 = class AttendanceService {
    prisma;
    logger = new common_1.Logger(AttendanceService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        this.logger.log(`Recording attendance for user ${data.userId}, course ${data.courseId}`);
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
    async findOne(id) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
        });
        if (!attendance) {
            this.logger.warn(`Attendance not found: ${id}`);
            throw new common_1.NotFoundException('Attendance not found');
        }
        return attendance;
    }
    async update(id, data) {
        this.logger.log(`Updating attendance: ${id}`);
        await this.findOne(id);
        const updated = await this.prisma.attendance.update({
            where: { id },
            data,
        });
        this.logger.log(`Attendance updated: ${id}`);
        return updated;
    }
    async remove(id) {
        this.logger.log(`Deleting attendance: ${id}`);
        await this.findOne(id);
        await this.prisma.attendance.delete({ where: { id } });
        this.logger.log(`Attendance deleted: ${id}`);
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = AttendanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map