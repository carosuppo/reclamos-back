import { Estados } from '@prisma/client';
import { Medidas } from '../../common/enums/medidas.enum';

export class ReclamoCompletoDTO {
  id: string;

  prioridad: Medidas;

  criticidad: Medidas;

  descripcion: string;

  estado: Estados;

  tipoReclamo: {
    id: string;
    nombre: string;
  };

  proyecto: {
    id: string;
    nombre: string;
    cliente: {
      id: string;
      nombre: string;
    };
  };
}
