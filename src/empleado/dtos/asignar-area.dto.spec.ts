import { AsignarAreaDTO } from './asignar-area.dto';

describe('AsignarAreaDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new AsignarAreaDTO();
    dto.areaId = 'area-1';

    expect(dto).toMatchObject({ areaId: 'area-1' });
  });
});
