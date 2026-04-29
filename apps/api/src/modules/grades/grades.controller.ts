import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  create(@Body() dto: CreateGradeDto) {
    return this.gradesService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'TEACHER')
  findAll() {
    return this.gradesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.gradesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateGradeDto) {
    return this.gradesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.gradesService.remove(id);
  }
}
