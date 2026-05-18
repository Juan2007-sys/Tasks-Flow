import { IsString, IsOptional } from "class-validator";

export class CrearProyectoDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}