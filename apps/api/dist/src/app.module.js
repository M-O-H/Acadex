"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const config_module_1 = require("./config/config.module");
const database_module_1 = require("./database/database.module");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const courses_module_1 = require("./modules/courses/courses.module");
const enrollment_module_1 = require("./modules/enrollment/enrollment.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const grades_module_1 = require("./modules/grades/grades.module");
const students_module_1 = require("./modules/students/students.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 60000,
                    limit: 10,
                },
                {
                    name: 'long',
                    ttl: 3600000,
                    limit: 100,
                },
            ]),
            config_module_1.ConfigModule,
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            courses_module_1.CoursesModule,
            enrollment_module_1.EnrollmentModule,
            attendance_module_1.AttendanceModule,
            grades_module_1.GradesModule,
            notifications_module_1.NotificationsModule,
            students_module_1.StudentsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map