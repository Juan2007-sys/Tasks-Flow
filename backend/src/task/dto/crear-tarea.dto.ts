import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CrearTareaDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  project: string;
}