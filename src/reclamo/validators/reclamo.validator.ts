import { ProyectoService } from 'src/proyecto/proyecto.service';
import { TipoReclamoService } from '../../tipo-reclamo/tipo-reclamo.service';
import { Inject, Injectable } from '@nestjs/common';
import { Estados } from '@prisma/client';
import { AreaService } from 'src/area/area.service';
import type { IReclamoRepository } from '../repositories/reclamo.repository.interface';
import { ClienteService } from 'src/cliente/cliente.service';

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

  async validateTipoReclamo(id: string): Promise<boolean> {
    const tipoReclamo = await this.tipoReclamoService.findOne(id);
    if (!tipoReclamo)
      throw new Error(`El tipo de reclamo con id ${id} no existe`);
    return true;
  }

  async validateProyecto(id: string): Promise<boolean> {
    const proyecto = await this.proyectoService.findOne(id);
    if (!proyecto) throw new Error(`El proyecto con id ${id} no existe`);
    return true;
  }

  async validateReclamo(id: string): Promise<boolean> {
    const reclamo = await this.repository.findOne(id);
    if (!reclamo) throw new Error(`El reclamo con id ${id} no existe`);
    return true;
  }

  async validateArea(id: string): Promise<boolean> {
    const area = await this.areaService.findOne(id);
    if (!area) throw new Error(`El área con id ${id} no existe`);
    return true;
  }

  validateCambioEstadoEmpleado(estadoActual: string, estadoNuevo: string) {
    if (estadoActual === estadoNuevo) {
      throw new Error('El estado actual es el mismo que el nuevo');
    }

    if (estadoActual === Estados.RESUELTO) {
      throw new Error('No se puede actualizar un reclamo resuelto');
    }

    if (estadoNuevo === Estados.PENDIENTE) {
      throw new Error('El estado nuevo no puede pasar a pendiente');
    }

    return true;
  }

  validateCambioEstadoCliente(estado: Estados) {
    if (estado === Estados.RESUELTO) {
      throw new Error('No se puede reasignar el área de un reclamo resuelto');
    }
  }

  async validateCliente(clienteId: string): Promise<boolean> {
    const cliente = await this.clienteService.findOne(clienteId);
    if (!cliente) throw new Error(`El cliente con id ${clienteId} no existe`);
    return true;
  }
}
