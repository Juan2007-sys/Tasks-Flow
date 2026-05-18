import { IsString, IsOptional } from 'class-validator';

export class ActualizarProyectoDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  status: string;
}
