import 'reflect-metadata';
import { ProyectoController } from './proyecto.controller';
import { ProyectoModule } from './proyecto.module';
import { ProyectoRepository } from './repositories/proyecto.repository';
import { ProyectoService } from './proyecto.service';
import { TipoProyectoModule } from 'src/tipo-proyecto/tipo-proyecto.module';

describe('ProyectoModule', () => {
  it('declara imports, controllers, providers y exports', () => {
    const imports = Reflect.getMetadata('imports', ProyectoModule) as unknown[];
    const controllers = Reflect.getMetadata('controllers', ProyectoModule) as unknown[];
    const providers = Reflect.getMetadata('providers', ProyectoModule) as unknown[];
    const exportsList = Reflect.getMetadata('exports', ProyectoModule) as unknown[];

    expect(imports).toEqual(expect.arrayContaining([TipoProyectoModule]));
    expect(controllers).toEqual(expect.arrayContaining([ProyectoController]));
    expect(providers).toEqual(expect.arrayContaining([ProyectoService]));

    const repoProvider = providers.find(
      (p: any) => p && p.provide === 'IProyectoRepository',
    );

    expect(repoProvider).toBeDefined();
    expect(repoProvider.useClass).toBe(ProyectoRepository);

    expect(exportsList).toEqual(expect.arrayContaining([ProyectoService]));
  });
});
