export class ReclamoHelper {
  constructor() {}

  calcularTiempoResolucion(
    reclamos: { createdAt: Date; updatedAt: Date }[],
  ): number {
    if (reclamos.length === 0) {
      return 0;
    }

    const totalMs = reclamos.reduce(
      (acc, r) => acc + (r.updatedAt.getTime() - r.createdAt.getTime()),
      0,
    );

    const promedioMs = totalMs / reclamos.length;

    return +(promedioMs / 8.64e7).toFixed(2);
  }

  calcularCantidadPromedio(resueltos: number, total: number): number {
    if (total === 0) return 0;
    return +(resueltos / total).toFixed(2);
  }
}
