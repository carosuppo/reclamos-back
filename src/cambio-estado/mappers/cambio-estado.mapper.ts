import { CambioEstado, Estados } from '@prisma/client';
import { ReasignarAreaDTO } from '../../reclamo/dtos/reasignar-area.dto';
import { UpdateEstadoDTO } from '../../reclamo/dtos/update-estado.dto';
import { CambioEstadoConUsuario } from '../cambio-estado.type';
import { CambioEstadoConUsuarioDTO } from '../dtos/cambio-estado-con-usuario.dto';
import { CambioEstadoDTO } from '../dtos/cambio-estado.dto';
import { CreateCambioEstadoDTO } from '../dtos/create-cambio-estado.dto';
import { CambioEstadoCreateData } from '../interfaces/cambio-estado.interface';

export const CambioEstadoMapper = {
  // Toma la información de la base de datos y la pasa a formato DTO
  toCambioEstadoDTO(cambio: CambioEstado): CambioEstadoDTO {
    return {
      id: cambio.id,
      reclamoId: cambio.reclamoId,
      areaId: cambio.areaId,
      fechaInicio: cambio.fechaInicio,
      fechaFin: cambio.fechaFin ?? null,
      descripcion: cambio.descripcion ?? null,
      estado: cambio.estado,
      empleadoId: cambio.empleadoId ?? null,
      clienteId: cambio.clienteId ?? null,
    };
  },

  toCambioEstadoConUsuarioDTO(
    cambio: CambioEstadoConUsuario,
  ): CambioEstadoConUsuarioDTO {
    return {
      id: cambio.id,
      reclamoId: cambio.reclamoId,
      area: {
        id: cambio.area.id,
        nombre: cambio.area.nombre,
      },
      fechaInicio: cambio.fechaInicio,
      fechaFin: cambio.fechaFin ?? null,
      descripcion: cambio.descripcion ?? null,
      estado: cambio.estado,
      usuario: cambio.empleado ?? cambio.cliente!,
    };
  },

  // Toma la información del DTO y la pasa a formato de la base de datos
  toCambioEstadoCreateData(dto: CreateCambioEstadoDTO): CambioEstadoCreateData {
    return {
      clienteId: dto.clienteId,
      reclamoId: dto.reclamoId,
      areaId: dto.areaId,
      empleadoId: dto.empleadoId,
      estado: dto.estado,
      descripcion: dto.descripcion,
    };
  },

  // Toma la información del DTO y la pasa a formato de la base de datos
  toCambioEstadoData(
    cambioEstado: CambioEstado,
    dto: UpdateEstadoDTO,
    userId: string,
  ): CambioEstadoCreateData {
    return {
      reclamoId: cambioEstado.reclamoId,
      areaId: cambioEstado.areaId,
      empleadoId: userId,
      estado: dto.estado,
      descripcion: dto.descripcion ?? '',
    };
  },

  toCambioEstadoClienteData(
    cambioEstado: CambioEstado,
    dto: ReasignarAreaDTO,
    userId: string,
  ): CambioEstadoCreateData {
    return {
      reclamoId: cambioEstado.reclamoId,
      areaId: dto.areaId,
      clienteId: userId,
      estado: Estados.PENDIENTE,
      descripcion: dto.descripcion,
    };
  },
};
