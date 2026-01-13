export interface areaCreateData {
  nombre: string;
  descripcion?: string;
}

export interface areaUpdateData extends Partial<areaCreateData> {
  id: string;
}
