import 'reflect-metadata';
import { AuthController } from './auth.controller';
import { AuthHelper } from './helpers/auth.helper';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthValidator } from './validators/auth.validator';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClienteModule } from '../cliente/cliente.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

describe('AuthModule', () => {
  it('declara imports, controllers, providers y exports', () => {
    const imports = Reflect.getMetadata('imports', AuthModule) as unknown[];
    const controllers = Reflect.getMetadata('controllers', AuthModule) as unknown[];
    const providers = Reflect.getMetadata('providers', AuthModule) as unknown[];
    const exportsList = Reflect.getMetadata('exports', AuthModule) as unknown[];

    expect(controllers).toEqual(expect.arrayContaining([AuthController]));
    expect(providers).toEqual(
      expect.arrayContaining([AuthService, JwtStrategy, AuthValidator, AuthHelper]),
    );

    expect(imports).toEqual(
      expect.arrayContaining([
        ConfigModule,
        ClienteModule,
        expect.objectContaining({ module: JwtModule }),
        expect.objectContaining({ forwardRef: expect.any(Function) }),
      ]),
    );

    expect(exportsList).toEqual(
      expect.arrayContaining([AuthService, AuthValidator]),
    );
  });
});
