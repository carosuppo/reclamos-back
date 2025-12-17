import { Medidas } from '../../common/enums/medidas.enum';

export function toMedidasEnum(estado: string): Medidas {
  const normalized = estado;

  switch (normalized) {
    case 'ALTA':
      return Medidas.ALTO;

    case 'MEDIA':
      return Medidas.MEDIO;

    case 'BAJA':
      return Medidas.BAJO;

    default:
      throw new Error(`Estado inválido: ${estado}`);
  }
}
