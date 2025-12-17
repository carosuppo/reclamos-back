import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dtos/create-reclamo.dto';
import type { IReclamoRepository } from './repositories/reclamo.repository.interface';
import { ReclamoDto } from './dtos/reclamo.dto';
import {
  toReclamoCreateData,
  toReclamoUpdateData,
} from './mappers/toReclamoEntity';
import { toReclamoDto } from './mappers/toReclamoDto';
import { ReclamoValidator } from './validators/reclamo.validator';
import { UpdateEstadoDto } from './dtos/update-estado.dto';
import { ReasignarAreaDto } from './dtos/reasignar-area.dto';
import { ReclamoHelper } from './helpers/reclamo.helper';
import {
  toCambioEstadoClienteData,
  toCambioEstadoData,
} from '../cambio-estado/mappers/toCambioEstadoEntity';
import { UpdateReclamoDto } from './dtos/update-reclamo.dto';
import { EmpleadoService } from 'src/empleado/empleado.service';
import { AreaValidator } from './validators/area.validator';
import { FindReclamoDto } from './dtos/find-reclamo.dto';
import { toFiltrosReclamoData } from './mappers/toFiltrosEntity';

@Injectable()
export class ReclamoService {
  constructor(
    @Inject('IReclamoRepository')
    private readonly repository: IReclamoRepository,
    private readonly validator: ReclamoValidator,
    private readonly areaValidator: AreaValidator,
    private readonly helper: ReclamoHelper,
    private readonly empleadoService: EmpleadoService,
  ) {}

  async create(dto: CreateReclamoDto, userId: string): Promise<ReclamoDto> {
    // 1. validar tipo de reclamo
    await this.validator.validateTipoReclamo(dto.tipoReclamoId);

    // 2. validar proyecto
    await this.validator.validateProyecto(dto.proyectoId);

    // 3. crear el reclamo base
    const data = toReclamoCreateData(dto, userId);
    const reclamo = await this.repository.create(data, userId);
    return toReclamoDto(reclamo);
  }

  async findByCliente(clienteId: string): Promise<ReclamoDto[]> {
    const reclamos = await this.repository.findByCliente(clienteId);
    return reclamos.map(toReclamoDto);
  }

  async update(id: string, dto: UpdateReclamoDto, userId: string) {
    //validar existencia del reclamo
    const reclamo = await this.helper.findOne(id);
    const cambioEstado = await this.helper.findLastCambioEstado(id);

    const data = toReclamoUpdateData(id, dto, userId, reclamo, cambioEstado);
    const updated = await this.repository.update(data);

    return toReclamoDto(updated);
  }

  async updateEstado(id: string, dto: UpdateEstadoDto, userId: string) {
    //validar existencia del reclamo
    await this.validator.validateReclamo(id);

    // traer el cambio de estado actual del reclamo
    const ultimoCambioEstado = await this.helper.findLastCambioEstado(id);

    // validar los cambio de estados posibles
    this.validator.validateCambioEstadoEmpleado(
      ultimoCambioEstado.estado,
      dto.estado,
    );

    // validar el area
    await this.areaValidator.validateArea(ultimoCambioEstado.areaId, userId);

    const dataCambioEstado = toCambioEstadoData(
      id,
      ultimoCambioEstado,
      dto,
      userId,
    );

    const updated = await this.repository.updateEstado(dataCambioEstado);

    return toReclamoDto(updated);
  }

  async reassignArea(id: string, dto: ReasignarAreaDto, userId: string) {
    //validar existencia del reclamo
    await this.validator.validateReclamo(id);

    await this.validator.validateArea(dto.areaId);

    // traer el cambio de estado actual del reclamo
    const cambioEstado = await this.helper.findLastCambioEstado(id);

    // validar el area
    await this.areaValidator.validateArea(cambioEstado.areaId, userId);

    // validar que el estado actual no sea Resuelto
    this.validator.validateCambioEstadoCliente(cambioEstado.estado);

    const dataCambioEstado = toCambioEstadoClienteData(
      cambioEstado,
      dto,
      userId,
    );

    const updated = await this.repository.reassignArea(dataCambioEstado);

    return toReclamoDto(updated);
  }

  async findByArea(userId: string): Promise<ReclamoDto[]> {
    // buscamos areaId del empleado
    const areaId = await this.empleadoService.findArea(userId);
    if (!areaId) {
      throw new BadRequestException('El empleado no tiene un area asignada.');
    }

    // traemos todos los reclamos
    const reclamos = await this.repository.findAll();

    // filtramos por último cambio de estado
    const reclamosFiltrados: ReclamoDto[] = [];

    for (const reclamo of reclamos) {
      const ultimoCambio = await this.helper.findLastCambioEstado(reclamo.id);

      if (ultimoCambio?.areaId === areaId) {
        reclamosFiltrados.push(toReclamoDto(reclamo));
      }
    }

    return reclamosFiltrados;
  }

  async findByFiltros(dto: FindReclamoDto): Promise<number> {
    const dataFindReclamo = toFiltrosReclamoData(dto);
    return await this.repository.findByFiltros(dataFindReclamo);
  }

  async getTiempoPromedioResolucion(areaId: string): Promise<number> {
    await this.validator.validateArea(areaId);
    const rangos = await this.repository.findDatesResueltos(areaId);
    const tiempoPromedio = this.helper.calcularTiempoResolucion(rangos);
    return tiempoPromedio;
  }

  async getCantidadPromedioResolucion(areaId: string): Promise<number> {
    await this.validator.validateArea(areaId);
    const total = await this.repository.countTotalByArea(areaId);
    const resueltos = await this.repository.countResueltosByArea(areaId);

    return this.helper.calcularCantidadPromedio(resueltos, total);
  }
}
