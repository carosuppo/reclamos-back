export interface ProyectoCreateData {
  nombre: string;
  descripcion?: string;
  clienteId: string;
  tipoProyectoId: string;
}

export interface ProyectoUpdateData extends Partial<ProyectoCreateData> {
  id: string;
}
