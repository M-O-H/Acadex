import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { GradesModule } from './modules/grades/grades.module';
import { StudentsModule } from './modules/students/students.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
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
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    CoursesModule,
    EnrollmentModule,
    AttendanceModule,
    GradesModule,
    NotificationsModule,
    StudentsModule,
  ],
})
export class AppModule {}
