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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const throttler_1 = require("@nestjs/throttler");
const path_1 = require("path");
const students_service_1 = require("./students.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const student_dto_1 = require("./dto/student.dto");
function customStorage() {
    return (0, multer_1.diskStorage)({
        destination: './uploads/student-photos',
        filename: (_req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
        },
    });
}
let StudentsController = class StudentsController {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    register(dto, photoFile) {
        return this.studentsService.register(dto, photoFile);
    }
    verifyOtp(dto) {
        return this.studentsService.verifyOtp(dto);
    }
    resendOtp(dto) {
        return this.studentsService.resendOtp(dto);
    }
    getPending() {
        return this.studentsService.getPendingStudents();
    }
    approve(userId) {
        return this.studentsService.approveStudent(userId);
    }
    reject(userId, dto) {
        return this.studentsService.rejectStudent(userId, dto.reason);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: customStorage(),
        fileFilter: (_req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new Error('Only image files are allowed (jpg, jpeg, png)'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 2 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_dto_1.StudentRegisterDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_dto_1.ResendOtpDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Get)('admin/pending'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getPending", null);
__decorate([
    (0, common_1.Post)('admin/:userId/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)('admin/:userId/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, student_dto_1.RejectStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "reject", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map