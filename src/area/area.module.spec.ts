import 'reflect-metadata';
import { AreaController } from './area.controller';
import { AreaModule } from './area.module';
import { AreaService } from './area.service';
import { AreaRepository } from './repositories/area.repository';
import { AreaValidator } from './validators/area.validator';

describe('AreaModule', () => {
  it('declara controllers, providers y exports', () => {
    const controllers = Reflect.getMetadata('controllers', AreaModule) as unknown[];
    const providers = Reflect.getMetadata('providers', AreaModule) as unknown[];
    const exportsList = Reflect.getMetadata('exports', AreaModule) as unknown[];

    expect(controllers).toEqual(expect.arrayContaining([AreaController]));
    expect(providers).toEqual(
      expect.arrayContaining([AreaService, AreaValidator]),
    );

    const repoProvider = providers.find(
      (p: any) => p && p.provide === 'IAreaRepository',
    );

    expect(repoProvider).toBeDefined();
    expect(repoProvider.useClass).toBe(AreaRepository);

    expect(exportsList).toEqual(
      expect.arrayContaining([AreaService, AreaValidator]),
    );
  });
});
