import { ApiProperty } from '@nestjs/swagger';

export class ClienteDto {
  @ApiProperty({
    example: '6918e2ebf030ce5632e8cac4',
    description: 'Identificador único del cliente',
  })
  id: string;

  @ApiProperty({
    example: 'cliente@example.com',
    description: 'Correo electrónico del cliente',
  })
  email: string;

  @ApiProperty({
    example: '3514567890',
    description: 'Número de teléfono del cliente',
  })
  telefono: string;

  @ApiProperty({
    example: 'Thomas Nahuel Moreno',
    description: 'Nombre completo del cliente',
  })
  nombre: string;
}
