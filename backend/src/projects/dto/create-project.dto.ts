import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Nombre del proyecto', example: 'Rediseño de Sitio Web' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción detallada del proyecto', example: 'Implementación del nuevo diseño UI/UX' })
  @IsString()
  @IsOptional()
  description?: string;
}
