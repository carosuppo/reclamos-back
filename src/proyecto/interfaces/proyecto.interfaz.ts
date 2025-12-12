export interface ProyectoInterfaz {
  nombre: string;
  descripcion?: string;
  clienteId: string;
  tipoProyectoId: string;
}

export type ProyectoInterfazParcial = Partial<ProyectoInterfaz>;
