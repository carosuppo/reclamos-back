import { Prisma } from '@prisma/client';

export type CambioEstadoConUsuario = Prisma.CambioEstadoGetPayload<{
  include: {
    empleado: {
      select: {
        id: true;
        nombre: true;
        email: true;
      };
    };
    cliente: {
      select: {
        id: true;
        nombre: true;
        email: true;
      };
    };
    area: {
      select: {
        id: true;
        nombre: true;
      };
    };
  };
}>;
