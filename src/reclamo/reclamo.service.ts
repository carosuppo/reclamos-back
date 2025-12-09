import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { ReclamosRepository } from './repositories/reclamos.repository';
import { TipoReclamoService } from 'src/tipo-reclamo/tipo-reclamo.service';
import { ReclamoDto } from './dto/reclamo.dto';
import { toReclamoCreateData } from './mappers/toReclamoEntity';
import { CambioEstadoService } from 'src/cambio-estado/cambio-estado.service';

@Injectable()
export class ReclamoService {
  constructor(
    private readonly reclamoRepository: ReclamosRepository,
    private readonly tipoReclamoService: TipoReclamoService,
    private readonly cambioEstadoService: CambioEstadoService,
  ) {}

  async create(dto: CreateReclamoDto, userId: string): Promise<ReclamoDto> {
    // 1. validar tipo de reclamo
    const existeTipo = await this.tipoReclamoService.findOne(dto.tipoReclamoId);
    if (!existeTipo) {
      throw new BadRequestException('Tipo de reclamo inexistente.');
    }

    // 2. crear el reclamo base
    const data = toReclamoCreateData(dto);
    const reclamo = await this.reclamoRepository.create(data);

    // 3. crear estado inicial
    const estadoInicial = { userId, reclamoId: reclamo.id, area: dto.area };
    await this.cambioEstadoService.create(estadoInicial);
  }
}
