import 'reflect-metadata';
import { AreaModule } from '../area/area.module';
import { CambioEstadoModule } from '../cambio-estado/cambio-estado.module';
import { ClienteModule } from '../cliente/cliente.module';
import { EmpleadoModule } from '../empleado/empleado.module';
import { ProyectoModule } from '../proyecto/proyecto.module';
import { TipoReclamoModule } from '../tipo-reclamo/tipo-reclamo.module';
import { ReclamoHelper } from './helpers/reclamo.helper';
import { ReclamoController } from './reclamo.controller';
import { ReclamoModule } from './reclamo.module';
import { ReclamoService } from './reclamo.service';
import { ReclamoRepository } from './repositories/reclamo.repository';
import { ReclamoValidator } from './validators/reclamo.validator';

describe('ReclamoModule', () => {
  it('declara imports, controllers y providers', () => {
    const imports = Reflect.getMetadata('imports', ReclamoModule) as unknown[];
    const controllers = Reflect.getMetadata(
      'controllers',
      ReclamoModule,
    ) as unknown[];
    const providers = Reflect.getMetadata(
      'providers',
      ReclamoModule,
    ) as unknown[];

    expect(imports).toEqual(
      expect.arrayContaining([
        TipoReclamoModule,
        CambioEstadoModule,
        ProyectoModule,
        AreaModule,
        EmpleadoModule,
        ClienteModule,
      ]),
    );

    expect(controllers).toEqual(expect.arrayContaining([ReclamoController]));

    expect(providers).toEqual(
      expect.arrayContaining([ReclamoService, ReclamoValidator, ReclamoHelper]),
    );

    const repoProvider = providers.find(
      (p: any) => p && p.provide === 'IReclamoRepository',
    );

    expect(repoProvider).toBeDefined();
    expect(repoProvider.useClass).toBe(ReclamoRepository);
  });
});
