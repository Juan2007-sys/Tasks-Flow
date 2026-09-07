import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../schemas/task.schema';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Título de la tarea', example: 'Diseñar interfaz actualizada' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción de la tarea' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Estado de la tarea' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
