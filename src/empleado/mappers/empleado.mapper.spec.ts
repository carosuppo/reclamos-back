import { EmpleadoMapper } from './empleado.mapper';
import { Role } from '../../common/enums/role.enum';

const empleadoEntity = {
  id: 'emp-1',
  email: 'e@test.com',
  contraseña: 'hash',
  nombre: 'Empleado',
  telefono: '123',
  areaId: null,
  role: Role.EMPLEADO,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('EmpleadoMapper', () => {
  it('toEmpleadoDTO mapea entidad', () => {
    const dto = EmpleadoMapper.toEmpleadoDTO(empleadoEntity as never);

    expect(dto).toEqual({
      id: 'emp-1',
      email: 'e@test.com',
      telefono: '123',
      nombre: 'Empleado',
      area: '',
    });
  });

  it('toEmpleadoEntity agrega role EMPLEADO', () => {
    const data = EmpleadoMapper.toEmpleadoEntity({
      email: 'e@test.com',
      contraseña: '123',
      nombre: 'Empleado',
      telefono: '123',
    } as never);

    expect(data).toEqual({
      email: 'e@test.com',
      contraseña: '123',
      nombre: 'Empleado',
      telefono: '123',
      role: Role.EMPLEADO,
    });
  });

  it('toEmpleadoUpdateData agrega id', () => {
    const data = EmpleadoMapper.toEmpleadoUpdateData('emp-1', {
      email: 'n@test.com',
    });

    expect(data).toEqual({
      id: 'emp-1',
      email: 'n@test.com',
      nombre: undefined,
      telefono: undefined,
    });
  });

  it('toAuthEmpleadoDTO mapea auth', () => {
    const dto = EmpleadoMapper.toAuthEmpleadoDTO(empleadoEntity as never);

    expect(dto).toEqual({
      id: 'emp-1',
      email: 'e@test.com',
      contraseña: 'hash',
      role: Role.EMPLEADO,
    });
  });
});
