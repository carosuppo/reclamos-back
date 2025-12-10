import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña electrónico del usuario',
  })
  @IsNotEmpty()
  contraseña!: string;

  @ApiProperty({
    example: 'Thomas Moreno',
    description: 'Nombre del usuario',
  })
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: '353435345',
    description: 'Teléfono del usuario',
  })
  @IsNotEmpty()
  telefono!: string;
}
