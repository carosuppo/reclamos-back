import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClienteModule } from '../cliente/cliente.module';
import { EmpleadoModule } from '../empleado/empleado.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './helpers/auth.helper';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthValidator } from './validators/auth.validator';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
    ClienteModule,
    forwardRef(() => EmpleadoModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthValidator, AuthHelper],
  exports: [AuthService, AuthValidator],
})
export class AuthModule {}
