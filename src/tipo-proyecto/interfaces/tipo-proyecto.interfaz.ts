export interface TipoProyectoInterfaz {
  nombre: string;
  descripcion?: string;
}

export type TipoProyectoInterfazParcial = Partial<TipoProyectoInterfaz>;
