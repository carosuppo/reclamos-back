import { Estados, Reclamo } from '@prisma/client';
import { CambioEstadoDTO } from '../../cambio-estado/dtos/cambio-estado.dto';
import { Medidas } from '../../common/enums/medidas.enum';
import { CreateReclamoDTO } from '../dtos/create-reclamo.dto';
import { FiltersDTO } from '../dtos/filters.dto';
import { ReclamoCompletoDTO } from '../dtos/reclamo-completo.dto';
import { ReclamoDTO } from '../dtos/reclamo.dto';
import { UpdateReclamoDTO } from '../dtos/update-reclamo.dto';
import {
  FiltrosReclamoData,
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo.interface';
import { ReclamoCompleto } from '../reclamo.type';

export const ReclamoMapper = {
  // Toma la información de la base de datos y la pasa a formato DTO
  toReclamoDTO(reclamo: Reclamo): ReclamoDTO {
    return {
      id: reclamo.id,
      tipoReclamo: reclamo.tipoReclamoId,
      proyecto: reclamo.proyectoId,
      prioridad: Medidas[reclamo.prioridad] as Medidas,
      criticidad: Medidas[reclamo.criticidad] as Medidas,
      descripcion: reclamo.descripcion,
      estado: reclamo.estado,
    };
  },

  toReclamoCompletoDTO(reclamo: ReclamoCompleto): ReclamoCompletoDTO {
    return {
      id: reclamo.id,
      prioridad: Medidas[reclamo.prioridad] as Medidas,
      criticidad: Medidas[reclamo.criticidad] as Medidas,
      descripcion: reclamo.descripcion,
      estado: reclamo.estado,
      tipoReclamo: {
        id: reclamo.tipoReclamo.id,
        nombre: reclamo.tipoReclamo.nombre,
      },
      proyecto: {
        id: reclamo.proyecto.id,
        nombre: reclamo.proyecto.nombre,
        cliente: {
          id: reclamo.proyecto.cliente.id,
          nombre: reclamo.proyecto.cliente.nombre,
        },
      },
    };
  },

  // Toma la información del DTO y la transforma al formato válido para su método (Crear reclamo)
  toReclamoCreateData(
    dto: CreateReclamoDTO,
    clienteId: string,
  ): ReclamoCreateData {
    return {
      tipoReclamoId: dto.tipoReclamoId,
      proyectoId: dto.proyectoId,
      prioridad: dto.prioridad,
      criticidad: dto.criticidad,
      areaId: dto.areaId,
      descripcion: dto.descripcion,
      estado: Estados.PENDIENTE,
      clienteId: clienteId,
    };
  },

  // Toma la información del DTO y la transforma al formato valido para su método (Actualizar reclamo)
  toReclamoUpdateData(
    id: string,
    dto: UpdateReclamoDTO,
    clienteId: string,
    reclamo: ReclamoDTO,
    cambioEstado: CambioEstadoDTO,
  ): ReclamoData {
    return {
      reclamoId: id,
      tipoReclamoId: dto.tipoReclamoId ?? reclamo.tipoReclamo,
      prioridad: dto.prioridad ?? reclamo.prioridad,
      criticidad: dto.criticidad ?? reclamo.criticidad,
      areaId: dto.areaId ?? cambioEstado.areaId,
      descripcion: dto.descripcion,
      estado: Estados.PENDIENTE,
      clienteId: clienteId,
    };
  },

  // Toma la información del DTO y la transforma al formato valido para su método (Buscar reclamos por filtros)
  toFiltrosReclamoData(dto: FiltersDTO): FiltrosReclamoData {
    return {
      estado: dto.estado ?? undefined,
      clienteId: dto.clienteId ?? undefined,
      fechaDesde: dto.fechaDesde ? new Date(dto.fechaDesde) : undefined,
      fechaHasta: dto.fechaHasta ? new Date(dto.fechaHasta) : undefined,
    };
  },
};
