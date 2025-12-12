import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCambioEstadoDto } from './dto/create-cambio-estado.dto';
import { toCambioEstadoCreateData } from './mappers/toCambioEstadoEntity';
import { toCambioEstadoDto } from './mappers/toCambioEstadoDto';
import { CambioEstadoDto } from './dto/cambioEstado.dto';
import { CambioEstadoValidator } from './validators/cambio-estado.validator';
import type { ICambioEstadoRepository } from './repositories/cambioEstado.repository.interface';

@Injectable()
export class CambioEstadoService {
  constructor(
    @Inject('ICambioEstadoRepository')
    private readonly cambioEstadoRepository: ICambioEstadoRepository,
    private readonly validator: CambioEstadoValidator,
  ) {}

  async setEstadoInicial(dto: CreateCambioEstadoDto): Promise<CambioEstadoDto> {
    //2. crear cambio de estado
    const data = toCambioEstadoCreateData(dto);
    const cambioEstado = await this.cambioEstadoRepository.create(data);

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
    const cambioEstado = await this.cambioEstadoRepository.create(data);

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
    const cambioEstado = await this.cambioEstadoRepository.create(data);

    if (!cambioEstado) {
      throw new BadRequestException('Error al crear el cambio de estado.');
    }

    return toCambioEstadoDto(cambioEstado);
  }
}
