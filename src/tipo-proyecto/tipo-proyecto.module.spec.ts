import 'reflect-metadata';
import { TipoProyectoController } from './tipo-proyecto.controller';
import { TipoProyectoModule } from './tipo-proyecto.module';
import { TipoProyectoRepository } from './repositories/tipo-proyecto.repository';
import { TipoProyectoService } from './tipo-proyecto.service';
import { TipoProyectoValidator } from './validators/tipo-proyecto.validator';

describe('TipoProyectoModule', () => {
  it('declara controllers, providers y exports', () => {
    const controllers = Reflect.getMetadata('controllers', TipoProyectoModule) as unknown[];
    const providers = Reflect.getMetadata('providers', TipoProyectoModule) as unknown[];
    const exportsList = Reflect.getMetadata('exports', TipoProyectoModule) as unknown[];

    expect(controllers).toEqual(
      expect.arrayContaining([TipoProyectoController]),
    );
    expect(providers).toEqual(
      expect.arrayContaining([TipoProyectoService, TipoProyectoValidator]),
    );

    const repoProvider = providers.find(
      (p: any) => p && p.provide === 'ITipoProyectoRepository',
    );

    expect(repoProvider).toBeDefined();
    expect(repoProvider.useClass).toBe(TipoProyectoRepository);

    expect(exportsList).toEqual(
      expect.arrayContaining([TipoProyectoService, TipoProyectoValidator]),
    );
  });
});
