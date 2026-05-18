import { PartialType } from '@nestjs/mapped-types';
import { CrearProyectoDto } from './crear-proyecto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CrearProyectoDto) {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsString()
    @IsOptional()
    estado?: string;
}
