import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProyectoDto } from './dtos/create-proyecto.dto';
import { UpdateProyectoDto } from './dtos/update-proyecto.dto';
import type { IProyectoRepository } from './repositories/proyecto.repository.interface';
import { aProyectoDto, aProyectoInterfaz } from './mappers/proyecto.mapper';
import { ProyectoInterfaz } from './interfaces/proyecto.interfaz';
import { ProyectoValidador } from './validators/proyecto.validator';

@Injectable()
export class ProyectoService {
  constructor(
    @Inject('IProyectoRepository')
    private readonly repository: IProyectoRepository,
    private readonly validator: ProyectoValidador,
  ) {}

  async create(dto: CreateProyectoDto, user: string) {
    await this.validator.validateTipoProyecto(dto.tipoProyectoId);

    const proyectoInterfaz = aProyectoInterfaz(dto, user) as ProyectoInterfaz;
    const proyecto = await this.repository.create(proyectoInterfaz);
    return aProyectoDto(proyecto);
  }

  async findAll(user: string) {
    const proyectos = await this.repository.findAll(user);
    return proyectos.map(aProyectoDto);
  }

  async findOneEmpleado(id: string) {
    const proyecto = await this.repository.findOne(id);

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return aProyectoDto(proyecto);
  }

  async findOneByCliente(id: string, clienteId: string) {
    const proyecto = await this.repository.findByIdAndCliente(id, clienteId);

    if (!proyecto) {
      throw new BadRequestException(
        'Proyecto inexistente o no pertenece al cliente',
      );
    }

    return aProyectoDto(proyecto);
  }

  async findByTipoProyecto(tipoProyectoId: string, user: string) {
    const proyectos = await this.repository.findByTipoProyecto(
      tipoProyectoId,
      user,
    );

    if (proyectos.length === 0) {
      throw new NotFoundException('No hay proyectos con este tipo de proyecto');
    }

    return proyectos.map(aProyectoDto);
  }

  async update(id: string, dto: UpdateProyectoDto, userId: string) {
    const proyectoExistente = await this.repository.findByIdAndCliente(
      id,
      userId,
    );

    if (!proyectoExistente) {
      throw new ForbiddenException(
        'No tenés permiso para modificar este proyecto',
      );
    }

    if (dto.tipoProyectoId) {
      await this.validator.validateTipoProyecto(dto.tipoProyectoId);
    }

    const proyectoInterfaz = aProyectoInterfaz(dto, userId);
    const proyecto = await this.repository.update(id, proyectoInterfaz);
    return aProyectoDto(proyecto);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}
