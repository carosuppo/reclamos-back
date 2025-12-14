import { Estados } from '@prisma/client';

export function toEstadoEnum(estado: string): Estados {
  const normalized = estado;

  switch (normalized) {
    case 'PENDIENTE':
      return Estados.PENDIENTE;

    case 'RESUELTO':
      return Estados.RESUELTO;

    case 'EN_PROCESO':
      return Estados.EN_PROCESO;

    default:
      throw new Error(`Estado inválido: ${estado}`);
  }
}
