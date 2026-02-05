import { Estados } from '@prisma/client';

interface usuarioData {
  id: string;
  nombre: string;
  email: string;
}

interface areaData {
  id: string;
  nombre: string;
}

export class CambioEstadoConUsuarioDTO {
  id: string;

  reclamoId: string;

  fechaInicio: Date;

  fechaFin: Date | null;

  descripcion: string | null;

  estado: Estados;

  usuario: usuarioData;

  area: areaData;
}
