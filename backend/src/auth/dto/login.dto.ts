
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'juan@ejemplo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: '123456' })
  @IsString()
  password!: string;
}