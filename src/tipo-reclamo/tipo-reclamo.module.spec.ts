import 'reflect-metadata';
import { TipoReclamoController } from './tipo-reclamo.controller';
import { TipoReclamoModule } from './tipo-reclamo.module';
import { TipoReclamoRepository } from './repositories/tipo-reclamo.repository';
import { TipoReclamoService } from './tipo-reclamo.service';

describe('TipoReclamoModule', () => {
  it('declara controllers, providers y exports', () => {
    const controllers = Reflect.getMetadata('controllers', TipoReclamoModule) as unknown[];
    const providers = Reflect.getMetadata('providers', TipoReclamoModule) as unknown[];
    const exportsList = Reflect.getMetadata('exports', TipoReclamoModule) as unknown[];

    expect(controllers).toEqual(
      expect.arrayContaining([TipoReclamoController]),
    );
    expect(providers).toEqual(expect.arrayContaining([TipoReclamoService]));

    const repoProvider = providers.find(
      (p: any) => p && p.provide === 'ITipoReclamoRepository',
    );

    expect(repoProvider).toBeDefined();
    expect(repoProvider.useClass).toBe(TipoReclamoRepository);

    expect(exportsList).toEqual(
      expect.arrayContaining([TipoReclamoService]),
    );
  });
});
