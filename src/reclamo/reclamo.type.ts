import { Prisma } from '@prisma/client';

export type ReclamoCompleto = Prisma.ReclamoGetPayload<{
  include: {
    tipoReclamo: {
      select: {
        id: true;
        nombre: true;
      };
    };
    proyecto: {
      select: {
        id: true;
        nombre: true;
        cliente: {
          select: {
            id: true;
            nombre: true;
          };
        };
      };
    };
  };
}>;
