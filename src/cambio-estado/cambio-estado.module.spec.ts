import 'reflect-metadata';
import { AreaModule } from '../area/area.module';
import { CambioEstadoController } from './cambio-estado.controller';
import { CambioEstadoModule } from './cambio-estado.module';
import { CambioEstadoService } from './cambio-estado.service';
import { CambioEstadoRepository } from './repositories/cambio-estado.repository';

describe('CambioEstadoModule', () => {
  it('declara imports, controllers y providers', () => {
    const imports = Reflect.getMetadata('imports', CambioEstadoModule) as unknown[];
    const controllers = Reflect.getMetadata('controllers', CambioEstadoModule) as unknown[];
    const providers = Reflect.getMetadata('providers', CambioEstadoModule) as unknown[];
    const exportsList = Reflect.getMetadata('exports', CambioEstadoModule) as unknown[];

    expect(imports).toEqual(expect.arrayContaining([AreaModule]));
    expect(controllers).toEqual(
      expect.arrayContaining([CambioEstadoController]),
    );
    expect(providers).toEqual(expect.arrayContaining([CambioEstadoService]));

    const repoProvider = providers.find(
      (p: any) => p && p.provide === 'ICambioEstadoRepository',
    );

    expect(repoProvider).toBeDefined();
    expect(repoProvider.useClass).toBe(CambioEstadoRepository);

    expect(exportsList).toEqual(
      expect.arrayContaining([CambioEstadoService, 'ICambioEstadoRepository']),
    );
  });
});
