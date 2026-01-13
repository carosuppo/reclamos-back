import { Proyecto } from '@prisma/client';
import {
  CreateProyectoDTO,
  UpdateProyectoDTO,
} from '../dtos/create-proyecto.dto';
import { ProyectoDTO } from '../dtos/proyecto.dto';
import {
  ProyectoCreateData,
  ProyectoUpdateData,
} from '../interfaces/proyecto.interface';

export const ProyectoMapper = {
  aProyectoDTO(proyecto: Proyecto): ProyectoDTO {
    // Mapear el proyecto para llevarlo al formato de transferencia de datos
    return {
      id: proyecto.id,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      tipoProyectoId: proyecto.tipoProyectoId,
    };
  },

  aProyectoCreateData(
    data: CreateProyectoDTO,
    user: string,
  ): ProyectoCreateData {
    // Mapear el DTO para llevarlo al formato esperado por el repositorio
    return {
      nombre: data.nombre,
      clienteId: user,
      descripcion: data.descripcion,
      tipoProyectoId: data.tipoProyectoId,
    };
  },

  aProyectoUpdateData(id: string, data: UpdateProyectoDTO): ProyectoUpdateData {
    // Mapear el DTO para llevarlo al formato esperado por el repositorio
    return { ...data, id: id };
  },
};
