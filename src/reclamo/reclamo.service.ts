import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Estados } from '@prisma/client';
import { CambioEstadoService } from '../cambio-estado/cambio-estado.service';
import { CambioEstadoMapper } from '../cambio-estado/mappers/cambio-estado.mapper';
import { EmpleadoService } from '../empleado/empleado.service';
import { CreateReclamoDTO } from './dtos/create-reclamo.dto';
import { FiltersDTO } from './dtos/filters.dto';
import { ReasignarAreaDTO } from './dtos/reasignar-area.dto';
import { ReclamoCompletoDTO } from './dtos/reclamo-completo.dto';
import { ReclamoDTO } from './dtos/reclamo.dto';
import { UpdateEstadoDTO } from './dtos/update-estado.dto';
import { UpdateReclamoDTO } from './dtos/update-reclamo.dto';
import { ReclamoHelper } from './helpers/reclamo.helper';
import { ReclamoMapper as mapper } from './mappers/reclamo.mapper';
import type { IReclamoRepository } from './repositories/reclamo.repository.interface';
import { ReclamoValidator } from './validators/reclamo.validator';

@Injectable()
export class ReclamoService {
  constructor(
    @Inject('IReclamoRepository')
    private readonly repository: IReclamoRepository,
    private readonly validator: ReclamoValidator,
    private readonly helper: ReclamoHelper,

    private readonly empleadoService: EmpleadoService,
    private readonly cambioEstadoService: CambioEstadoService,
  ) {}

  async create(dto: CreateReclamoDTO, userId: string): Promise<ReclamoDTO> {
    // CREA UN RECLAMO, JUNTO CON SU CAMBIO DE ESTADO INICIAL (PENDIENTE)

    // Valida existencia del tipo de reclamo, proyecto y área
    await this.validator.validateCreate(
      dto.tipoReclamoId,
      dto.proyectoId,
      dto.areaId,
    );

    // Mapea al formato esperado por el repositorio
    const data = mapper.toReclamoCreateData(dto, userId);

    // Crea el reclamo con su primer cambio de estado
    const reclamo = await this.repository.create(data, userId);
    return mapper.toReclamoDTO(reclamo);
  }

  async update(
    id: string,
    dto: UpdateReclamoDTO,
    userId: string,
  ): Promise<ReclamoDTO> {
    // ACTUALIZA LOS DATOS DEL RECLAMO, DEVOLVIENDO SU ESTADO A PENDIENTE

    // Trae el reclamo con su ultimo cambio de estado
    const reclamo = await this.findById(id);
    const cambioEstado =
      await this.cambioEstadoService.findLastCambioEstado(id);

    // Mapea la información del DTO y la pasa a formato válido para su método (Actualizar reclamo)
    const data = mapper.toReclamoUpdateData(
      id,
      dto,
      userId,
      reclamo,
      cambioEstado,
    );

    const updated = await this.repository.update(data);

    // Mapea la información traída de la BD a DTO
    return mapper.toReclamoDTO(updated);
  }

  async changeEstado(
    id: string,
    dto: UpdateEstadoDTO,
    userId: string,
  ): Promise<ReclamoDTO> {
    // CAMBIA EL ESTADO DEL RECLAMO, GUARDANDO EL USUARIO QUE HIZO EL CAMBIO

    // Valida existencia del reclamo
    await this.validator.validateReclamo(id);

    // Trae el cambio de estado actual del reclamo (Cambio estado ctual)
    const estadoActual =
      await this.cambioEstadoService.findLastCambioEstado(id);

    // Valida los cambio de estados posibles
    this.validator.validateCambioEstado(estadoActual.estado, dto.estado);

    // Mapea la información del DTO y la pasa a formato válido para su método (Actualizar estado)
    const dataCambioEstado = CambioEstadoMapper.toCambioEstadoData(
      estadoActual,
      dto,
      userId,
    );

    const updated = await this.repository.changeEstado(dataCambioEstado);

    // Mapea la información traída de la BD a DTO
    return mapper.toReclamoDTO(updated);
  }

  async reassignArea(
    id: string,
    dto: ReasignarAreaDTO,
    userId: string,
  ): Promise<ReclamoDTO> {
    // REASIGNA EL ÁREA DEL RECLAMO, VOLVIENDO SU ESTADO A PENDIENTE

    // Valida todo lo necesario para cumplir con el método
    await this.validator.validateReassignArea(id, dto.areaId);

    // Trae el estado actual del reclamo
    const cambioEstado =
      await this.cambioEstadoService.findLastCambioEstado(id);

    // Valida que se cumpla la regla de negocio sobre cambios de estado
    this.validator.validateCambioEstado(cambioEstado.estado);

    // Mapea la información del DTO y la pasa a formato válido para su método (Reasignar área)
    const data = CambioEstadoMapper.toCambioEstadoClienteData(
      cambioEstado,
      dto,
      userId,
    );

    const reclamo = await this.repository.reassignArea(data);

    // Mapea la información traída de la BD a DTO
    return mapper.toReclamoDTO(reclamo);
  }

  async findById(id: string): Promise<ReclamoDTO> {
    // Trae el reclamo según el ID
    const reclamo = await this.repository.findById(id);
    if (!reclamo) throw new NotFoundException('Reclamo no encontrado');

    // Mapea la información traída de la BD a DTO
    return mapper.toReclamoDTO(reclamo);
  }

  async findByCliente(clienteId: string): Promise<ReclamoCompletoDTO[]> {
    // TRAE LOS RECLAMOS ASOCIADOS AL CLIENTE

    const reclamos = await this.repository.findByCliente(clienteId);

    // Mapea la información traída de la BD a array DTO
    return reclamos.map((reclamo) => mapper.toReclamoCompletoDTO(reclamo));
  }

  async findByArea(userId: string): Promise<ReclamoCompletoDTO[]> {
    // TRAE LOS RECLAMOS ASOCIADOS AL ÁREA DEL EMPLEADO

    // Trae el id del área del empleado
    const areaId = await this.empleadoService.findAreaById(userId);

    // Trae todos los reclamos del área
    const reclamos = await this.repository.findByArea(areaId);

    // Mapea la información traída de la BD a array DTO
    return reclamos.map((reclamo) => mapper.toReclamoCompletoDTO(reclamo));
  }

  async countByFiltros(dto: FiltersDTO): Promise<number> {
    // RETORNA EL NÚMERO DE TODOS LOS RECLAMOS QUE CUMPLAN CON LOS FILTROS

    const data = mapper.toFiltrosReclamoData(dto);
    return await this.repository.countByFiltros(data);
  }

  async getTiemProm(areaId: string): Promise<number> {
    // RETORNA EL TIEMPO PROMEDIO DE RESOLUCIÓN DE LOS RECLAMOS RESUELTOS

    // Valida existencia del área
    await this.validator.validateArea(areaId);

    // Trae el rango de fechas de todos los reclamos RESUELTOS
    const rangos = await this.repository.findDates(areaId, Estados.RESUELTO);

    // Calcula el promedio de resolución
    return this.helper.calcularTiempoResolucion(rangos);
  }

  async getCantProm(areaId: string): Promise<number> {
    // RETORNA EL PROMEDIO DE LOS RECLAMOS RESUELTOS SOBRE LA CANTIDAD TOTAL DE RECLAMOS

    // Valida existencia del área
    await this.validator.validateArea(areaId);

    // Trae el número de reclamos total
    const total = await this.repository.countByArea(areaId);

    // Trae el número de los reclamos RESUELTOS
    const resueltos = await this.repository.countByArea(
      areaId,
      Estados.RESUELTO,
    );

    // Calcula el promedio de resolución
    return this.helper.calcularCantidadPromedio(resueltos, total);
  }
}
