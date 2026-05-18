import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class ActualizarTareaDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}