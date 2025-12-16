import { Inject, Injectable } from '@nestjs/common';
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
import { ReclamoHelper } from './helper/reclamo.helper';
import {
  toCambioEstadoClienteData,
  toCambioEstadoData,
} from '../cambio-estado/mappers/toCambioEstadoEntity';
import { UpdateReclamoDto } from './dtos/update-reclamo.dto';

@Injectable()
export class ReclamoService {
  constructor(
    @Inject('IReclamoRepository')
    private readonly repository: IReclamoRepository,
    private readonly validator: ReclamoValidator,
    private readonly helper: ReclamoHelper,
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
    return await this.repository.update(data);
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

    const dataCambioEstado = toCambioEstadoData(
      id,
      ultimoCambioEstado,
      dto,
      userId,
    );

    return await this.repository.updateEstado(dataCambioEstado);
  }

  async reassignArea(id: string, dto: ReasignarAreaDto, userId: string) {
    //validar existencia del reclamo
    await this.validator.validateReclamo(id);

    await this.validator.validateArea(dto.areaId);

    // traer el cambio de estado actual del reclamo
    const cambioEstado = await this.helper.findLastCambioEstado(id);

    // validar que el estado actual no sea Resuelto
    this.validator.validateCambioEstadoCliente(cambioEstado.estado);

    const dataCambioEstado = toCambioEstadoClienteData(
      cambioEstado,
      dto,
      userId,
    );

    return await this.repository.reassignArea(dataCambioEstado);
  }
}
