import { Inject, Injectable } from '@nestjs/common';
import { Estados } from '@prisma/client';
import { AreaService } from '../../area/area.service';
import { ClienteService } from '../../cliente/cliente.service';
import { ProyectoService } from '../../proyecto/proyecto.service';
import { TipoReclamoService } from '../../tipo-reclamo/tipo-reclamo.service';
import type { IReclamoRepository } from '../repositories/reclamo.repository.interface';

@Injectable()
export class ReclamoValidator {
  constructor(
    private readonly tipoReclamoService: TipoReclamoService,
    private readonly proyectoService: ProyectoService,
    private readonly areaService: AreaService,
    private readonly clienteService: ClienteService,
    @Inject('IReclamoRepository')
    private readonly repository: IReclamoRepository,
  ) {}

  async validateTipoReclamo(id: string): Promise<void> {
    const tipoReclamo = await this.tipoReclamoService.findById(id);
    if (!tipoReclamo)
      throw new Error(`El tipo de reclamo con id ${id} no existe`);
  }

  async validateProyecto(id: string): Promise<void> {
    const proyecto = await this.proyectoService.findById(id);
    if (!proyecto) throw new Error(`El proyecto con id ${id} no existe`);
  }

  async validateReclamo(id: string): Promise<void> {
    const reclamo = await this.repository.findById(id);
    if (!reclamo) throw new Error(`El reclamo con id ${id} no existe`);
  }

  async validateArea(id: string): Promise<void> {
    const area = await this.areaService.findById(id);
    if (!area) throw new Error(`El área con id ${id} no existe`);
  }

  validateCambioEstado(estadoActual: string, estadoNuevo?: string): void {
    if (estadoActual === Estados.RESUELTO) {
      throw new Error('No se puede actualizar un reclamo resuelto');
    }

    if (estadoActual === estadoNuevo) {
      throw new Error('El estado actual no puede ser el nuevo estado');
    }

    if (estadoNuevo === Estados.PENDIENTE) {
      throw new Error('El estado nuevo no puede pasar a pendiente');
    }
  }

  async validateCliente(clienteId: string): Promise<void> {
    const cliente = await this.clienteService.findById(clienteId);
    if (!cliente) throw new Error(`El cliente con id ${clienteId} no existe`);
  }

  async validateCreate(
    tipoReclamoId: string,
    proyectoId: string,
    areaId: string,
  ): Promise<void> {
    // Agrupa los 3 métodos de validación
    await this.validateTipoReclamo(tipoReclamoId);
    await this.validateProyecto(proyectoId);
    await this.validateArea(areaId);
  }
  async validateReassignArea(reclamoId: string, areaId: string): Promise<void> {
    // valida el reclamo y su area
    await this.validateReclamo(reclamoId);
    await this.validateArea(areaId);
  }
}
