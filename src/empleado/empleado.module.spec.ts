import 'reflect-metadata';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoModule } from './empleado.module';
import { EmpleadoRepository } from './repositories/empleado.repository';
import { EmpleadoService } from './empleado.service';
import { EmpleadoValidator } from './validators/empleado.validator';
import { AreaModule } from '../area/area.module';

describe('EmpleadoModule', () => {
  it('declara imports, controllers, providers y exports', () => {
    const imports = Reflect.getMetadata('imports', EmpleadoModule) as unknown[];
    const controllers = Reflect.getMetadata('controllers', EmpleadoModule) as unknown[];
    const providers = Reflect.getMetadata('providers', EmpleadoModule) as unknown[];
    const exportsList = Reflect.getMetadata('exports', EmpleadoModule) as unknown[];

    expect(imports).toEqual(
      expect.arrayContaining([
        AreaModule,
        expect.objectContaining({ forwardRef: expect.any(Function) }),
      ]),
    );
    expect(controllers).toEqual(expect.arrayContaining([EmpleadoController]));
    expect(providers).toEqual(
      expect.arrayContaining([EmpleadoService, EmpleadoValidator]),
    );

    const repoProvider = providers.find(
      (p: any) => p && p.provide === 'IEmpleadoRepository',
    );

    expect(repoProvider).toBeDefined();
    expect(repoProvider.useClass).toBe(EmpleadoRepository);

    expect(exportsList).toEqual(
      expect.arrayContaining([EmpleadoService, EmpleadoValidator]),
    );
  });
});
