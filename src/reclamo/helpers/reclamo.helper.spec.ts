import { ReclamoHelper } from './reclamo.helper';

describe('ReclamoHelper', () => {
  let helper: ReclamoHelper;

  beforeEach(() => {
    helper = new ReclamoHelper();
  });

  describe('calcularTiempoResolucion', () => {
    it('retorna 0 si no hay reclamos', () => {
      expect(helper.calcularTiempoResolucion([])).toBe(0);
    });

    it('calcula el promedio en dias con 2 decimales', () => {
      const base = new Date('2026-02-01T00:00:00Z');
      const reclamos = [
        { createdAt: base, updatedAt: new Date(base.getTime() + 86400000) },
        { createdAt: base, updatedAt: new Date(base.getTime() + 3 * 86400000) },
      ];

      const result = helper.calcularTiempoResolucion(reclamos);

      expect(result).toBe(2);
    });
  });

  describe('calcularCantidadPromedio', () => {
    it('retorna 0 si total es 0', () => {
      expect(helper.calcularCantidadPromedio(5, 0)).toBe(0);
    });

    it('calcula el promedio con 2 decimales', () => {
      expect(helper.calcularCantidadPromedio(1, 3)).toBe(0.33);
    });
  });
});
