import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({ description: 'Título de la tarea', example: 'Diseñar interfaz de usuario' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Descripción detallada de la tarea', example: 'Crear wireframes en Figma' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDIENTE, description: 'Estado inicial de la tarea' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ description: 'ID del proyecto al que pertenece la tarea', example: '65e9b8f2a1b2c3d4e5f6a7b8' })
  @IsMongoId()
  @IsNotEmpty()
  project: string;
}
