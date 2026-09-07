import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiPropertyOptional({ description: 'Nombre del proyecto', example: 'Rediseño de Sitio Web Actualizado' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Descripción del proyecto' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Estado del proyecto', enum: ['active', 'completed'], example: 'completed' })
  @IsString()
  @IsIn(['active', 'completed'])
  @IsOptional()
  status?: string;
}
