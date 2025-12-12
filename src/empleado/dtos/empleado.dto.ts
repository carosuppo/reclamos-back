import { ApiProperty } from '@nestjs/swagger';
import { AreaDto } from '../../area/dtos/area.dto';

export class EmpleadoDto {
  @ApiProperty({
    example: 'd92a44c1-58f4-4ae5-bc67-2fa10c5e1e3f',
    description: 'Identificador único del empleado',
  })
  id: string;

  @ApiProperty({
    example: 'empleado@example.com',
    description: 'Correo del empleado',
  })
  email: string;

  @ApiProperty({
    example: '1122334455',
    description: 'Número de teléfono del empleado',
  })
  telefono: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del empleado',
  })
  nombre: string;

  @ApiProperty({
    example: 'Facturación',
    description: 'Área asignada al empleado',
  })
  area: AreaDto | null;
}
