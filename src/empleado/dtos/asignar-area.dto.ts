import { IsValidId } from '../../common/decorators/swaggers/dto.swagger';

export class AsignarAreaDTO {
  @IsValidId('Área') // Nombre de la tabla
  areaId!: string;
}
