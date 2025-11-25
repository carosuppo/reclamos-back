export interface ProyectoInterfaz {
  nombre: string;
  descripcion?: string;
  tipoProyectoId: string;
}

export type ProyectoInterfazParcial = Partial<ProyectoInterfaz>;
