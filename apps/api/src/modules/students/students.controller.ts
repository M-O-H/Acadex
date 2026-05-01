import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ThrottlerGuard } from '@nestjs/throttler';
import { extname } from 'path';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  StudentRegisterDto,
  VerifyOtpDto,
  // ResendOtpDto,
  RejectStudentDto,
} from './dto/student.dto';

function customStorage() {
  return diskStorage({
    destination: './uploads/student-photos',
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  });
}

@Controller('students')
@UseGuards(ThrottlerGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: customStorage(),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Only image files are allowed (jpg, jpeg, png)'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  register(
    @Body() dto: StudentRegisterDto,
    @UploadedFile() photoFile: Express.Multer.File,
  ) {
    return this.studentsService.register(dto, photoFile);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.studentsService.verifyOtp(dto);
  }

  // @Post('resend-otp')
  // resendOtp(@Body() dto: ResendOtpDto) {
  //   return this.studentsService.resendOtp(dto);
  // }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getPending() {
    return this.studentsService.getPendingStudents();
  }

  @Post('admin/:userId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  approve(@Param('userId') userId: string) {
    return this.studentsService.approveStudent(userId);
  }

  @Post('admin/:userId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  reject(@Param('userId') userId: string, @Body() dto: RejectStudentDto) {
    return this.studentsService.rejectStudent(userId, dto.reason);
  }
}
