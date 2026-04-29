import { IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  userId: string;

  @IsString()
  courseId: string;

  @IsDateString()
  date: string;

  @IsBoolean()
  present: boolean;
}
