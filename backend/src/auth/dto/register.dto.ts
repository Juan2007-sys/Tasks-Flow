import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Nombre completo del usuario', example: 'Juan Pérez' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Correo electrónico único', example: 'juan@ejemplo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Contraseña (mínimo 6 caracteres)', example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;
}