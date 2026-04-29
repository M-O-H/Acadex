import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateGradeDto {
  @IsString()
  userId: string;

  @IsString()
  courseId: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxValue?: number;
}
