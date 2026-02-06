import 'reflect-metadata';
import { ClienteController } from './cliente.controller';
import { ClienteModule } from './cliente.module';
import { ClienteRepository } from './repositories/cliente.repository';
import { ClienteService } from './cliente.service';
import { ClienteValidator } from './validators/cliente.validator';

describe('ClienteModule', () => {
  it('declara controllers, providers y exports', () => {
    const controllers = Reflect.getMetadata('controllers', ClienteModule) as unknown[];
    const providers = Reflect.getMetadata('providers', ClienteModule) as unknown[];
    const exportsList = Reflect.getMetadata('exports', ClienteModule) as unknown[];

    expect(controllers).toEqual(expect.arrayContaining([ClienteController]));
    expect(providers).toEqual(
      expect.arrayContaining([ClienteService, ClienteRepository, ClienteValidator]),
    );

    const repoProvider = providers.find(
      (p: any) => p && p.provide === 'IClienteRepository',
    );

    expect(repoProvider).toBeDefined();
    expect(repoProvider.useClass).toBe(ClienteRepository);

    expect(exportsList).toEqual(
      expect.arrayContaining([ClienteService, ClienteValidator]),
    );
  });
});
