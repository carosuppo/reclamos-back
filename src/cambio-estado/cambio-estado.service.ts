import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCambioEstadoDto } from './dto/create-cambio-estado.dto';
import { AreaService } from 'src/area/area.service';

@Injectable()
export class CambioEstadoService {
  constructor(
    private readonly cambioEstadoRepository: CambioEstadoRepository,
    private readonly areaService: AreaService,
  ) {}

  async create(dto: CreateCambioEstadoDto): Promise<CambioEstadoDto | null> {
    //1. validar area
    const existeArea = await this.areaService.findById(dto.area);
    if (!existeArea) {
      throw new BadRequestException('Área inexistente.');
    }

    const data = toCambioEstadoCreateData(dto);
    const reclamo = await this.reclamoRepository.create(data);
  }
}
