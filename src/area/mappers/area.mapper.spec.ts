import { AreaMapper } from './area.mapper';
import { Area } from '@prisma/client';

const areaEntity: Area = {
  id: 'area-1',
  nombre: 'Ventas',
  descripcion: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('AreaMapper', () => {
  it('toAreaDto mapea null descripcion a string vacio', () => {
    const dto = AreaMapper.toAreaDto(areaEntity);

    expect(dto).toEqual({
      id: 'area-1',
      nombre: 'Ventas',
      descripcion: '',
    });
  });

  it('toAreaCreateData mapea datos del DTO', () => {
    const data = AreaMapper.toAreaCreateData({
      nombre: 'Soporte',
      descripcion: 'Area soporte',
    });

    expect(data).toEqual({
      nombre: 'Soporte',
      descripcion: 'Area soporte',
    });
  });

  it('toAreaUpdateData agrega id', () => {
    const data = AreaMapper.toAreaUpdateData('area-2', {
      nombre: 'Marketing',
      descripcion: 'Area marketing',
    });

    expect(data).toEqual({
      id: 'area-2',
      nombre: 'Marketing',
      descripcion: 'Area marketing',
    });
  });
});
