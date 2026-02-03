import { Medidas } from '../../common/enums/medidas.enum';

export function toMedidasEnum(estado: string): Medidas {
  const normalized = estado;

  switch (normalized) {
    case 'ALTA':
      return Medidas.ALTA;

    case 'MEDIA':
      return Medidas.MEDIA;

    case 'BAJA':
      return Medidas.BAJA;

    default:
      throw new Error(`Estado inválido: ${estado}`);
  }
}
