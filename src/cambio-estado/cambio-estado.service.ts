import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCambioEstadoDto } from './dtos/create-cambio-estado.dto';
import { toCambioEstadoCreateData } from './mappers/toCambioEstadoEntity';
import { toCambioEstadoDto } from './mappers/toCambioEstadoDto';
import { CambioEstadoDto } from './dtos/cambio-estado.dto';
import { CambioEstadoValidator } from './validators/cambio-estado.validator';
import type { ICambioEstadoRepository } from './repositories/cambio-estado.repository.interface';
import { toEstadoEnum } from './mappers/toEstadoEnum';

@Injectable()
export class CambioEstadoService {
  constructor(
    @Inject('ICambioEstadoRepository')
    private readonly repository: ICambioEstadoRepository,
    private readonly validator: CambioEstadoValidator,
  ) {}

  async setEstadoInicial(dto: CreateCambioEstadoDto): Promise<CambioEstadoDto> {
    //2. crear cambio de estado
    const data = toCambioEstadoCreateData(dto);
    const cambioEstado = await this.repository.create(data);

    if (!cambioEstado) {
      throw new BadRequestException('Error al crear el cambio de estado.');
    }

    return toCambioEstadoDto(cambioEstado);
  }

  async setEstadoEnProceso(
    dto: CreateCambioEstadoDto,
  ): Promise<CambioEstadoDto> {
    //2. crear cambio de estado
    const data = toCambioEstadoCreateData(dto);
    const cambioEstado = await this.repository.create(data);

    if (!cambioEstado) {
      throw new BadRequestException('Error al crear el cambio de estado.');
    }

    return toCambioEstadoDto(cambioEstado);
  }

  async setEstadoTerminado(
    dto: CreateCambioEstadoDto,
  ): Promise<CambioEstadoDto> {
    //2. crear cambio de estado
    const data = toCambioEstadoCreateData(dto);
    const cambioEstado = await this.repository.create(data);

    if (!cambioEstado) {
      throw new BadRequestException('Error al crear el cambio de estado.');
    }

    return toCambioEstadoDto(cambioEstado);
  }

  async findByReclamo(id: string): Promise<CambioEstadoDto[]> {
    const cambios = await this.repository.findByReclamoId(id);
    return cambios.map(toCambioEstadoDto);
  }

  async findByEstado(estado: string): Promise<CambioEstadoDto[]> {
    estado = toEstadoEnum(estado);
    const cambios = await this.repository.findByEstado(estado);
    return cambios.map(toCambioEstadoDto);
  }
}
