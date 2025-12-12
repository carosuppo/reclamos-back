/* eslint-disable prettier/prettier */
import { BadRequestException } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteRepository } from './repositories/cliente.repository';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UpdateClienteDto } from './dtos/update.cliente.dto';
import { AuthMapper } from 'src/common/mappers/toAuthDto.mapper';
import { Cliente } from '@prisma/client';

jest.mock('src/common/mappers/toUsuarioEntity.mapper', () => ({
  toUsuarioEntity: (dto: any) => ({ ...dto, mock: true }),
}));

jest.mock('./mappers/toClienteDto.mapper', () => ({
  toClienteDto: (ent: any) => ({ ...ent, dto: true }),
}));

jest.mock('./mappers/toClienteParcial.mapper', () => ({
  toClienteUpdateData: (dto: any) => ({ ...dto, parcial: true }),
}));

describe('ClienteService', () => {
  let service: ClienteService;
  let repo: jest.Mocked<ClienteRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    service = new ClienteService(repo);
  });

  // --------------------------------------------------------
  // register()
  // --------------------------------------------------------
  it('register debe crear cliente y devolver dto', async () => {
    const dto: RegisterDto = {
      email: 'mail@test.com',
      contraseña: '1234',
      nombre: 'pepe',
      telefono: '351'
    };

    repo.create = jest.fn().mockResolvedValue({
      id: '1',
      email: dto.email
    } as Cliente);

    const result = await service.register(dto);

    expect(result).toEqual({
      id: '1',
      email: dto.email,
      dto: true
    });

    const createMock = repo.create;
    expect(createMock).toHaveBeenCalled();
  });

  it('register debe manejar error y lanzar mensaje descriptivo', async () => {
    const dto: RegisterDto = {
      email: 'mail@test.com',
      contraseña: '1234',
      nombre: 'pepe',
      telefono: '351'
    };

    repo.create.mockRejectedValue(new Error('falló'));

    await expect(service.register(dto))
      .rejects
      .toThrow('Error al crear el cliente: falló');
  });

  // --------------------------------------------------------
  // findOne()
  // --------------------------------------------------------
  it('findOne debe devolver null si no existe', async () => {
    repo.findByEmail.mockResolvedValue(null);

    const result = await service.findOne('a@a.com');
    expect(result).toBeNull();
  });

  it('findOne debe mapear y devolver cliente', async () => {
    repo.findByEmail.mockResolvedValue({ id: '77', email: 'a@a.com' } as Partial<Cliente> as Cliente);

    const result = await service.findOne('a@a.com');
    expect(result).toEqual({ id: '77', email: 'a@a.com', dto: true });
  });

  // --------------------------------------------------------
  // update()
  // --------------------------------------------------------
  it('update debe lanzar error si el cliente no existe', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.update('10', {} as UpdateClienteDto))
      .rejects
      .toThrow(BadRequestException);
  });

  it('update debe rechazar email duplicado', async () => {
    repo.findById.mockResolvedValue({
      id: '10'
    } as Partial<Cliente> as Cliente);

    repo.findByEmail.mockResolvedValue({ id: '20', email: 'otro@mail.com' } as Partial<Cliente> as Cliente);

    const dto: UpdateClienteDto = { email: 'otro@mail.com' };

    await expect(service.update('10', dto))
      .rejects
      .toThrow('El email ya está en uso.');
  });

  it('update debe actualizar correctamente', async () => {
    repo.findById.mockResolvedValue({
      id: '10'
    } as Partial<Cliente> as Cliente);

    repo.findByEmail.mockResolvedValue(null);

    repo.update.mockResolvedValue({
      id: '10',
      nombre: 'nuevo'
    } as Partial<Cliente> as Cliente);

    const dto: UpdateClienteDto = { nombre: 'nuevo' };

    const result = await service.update('10', dto);

    expect(result).toEqual({ id: '10', nombre: 'nuevo' });
    expect(repo.update).toHaveBeenCalledWith('10', { nombre: 'nuevo', parcial: true });
  });

  // --------------------------------------------------------
  // findForAuth()
  // --------------------------------------------------------
  it('findForAuth debe devolver null si no existe', async () => {
    repo.findByEmail.mockResolvedValue(null);

    const result = await service.findForAuth('correo@mail.com');

    expect(result).toBeNull();
  });

it('findForAuth debe devolver AuthDto usando AuthMapper', async () => {
  // Mock del cliente que devuelve el repo
  const fakeCliente: Partial<Cliente> = {
    id: "41bbgsf77",
    email: 'x',
    contraseña: 'y',
    role: 'CLIENTE'
  };

  repo.findByEmail.mockResolvedValue(fakeCliente as Cliente);

  // Mock del mapper
  const spy = jest.spyOn(AuthMapper, 'toAuthDto').mockReturnValue({
    id: "41bbgsf77",
    email: 'x',
    contraseña: 'y',
    role: 'CLIENTE'
  });

  const result = await service.findForAuth('x');

  expect(result).toEqual({
    id: "41bbgsf77",
    email: 'x',
    contraseña: 'y',
    role: 'CLIENTE'
  });

  expect(spy).toHaveBeenCalledWith(fakeCliente, 'CLIENTE');
});


  // --------------------------------------------------------
  // remove()
  // --------------------------------------------------------
  it('remove debe devolver string fijo', () => {
    const result = service.remove(5);
    expect(result).toBe('This action removes a #5 cliente');
  });
});
