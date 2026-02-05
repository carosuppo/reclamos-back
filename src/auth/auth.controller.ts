import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  SwaggerLogin,
  SwaggerRegisterCliente,
  SwaggerRegisterEmpleado,
} from './swaggers/auth.swagger';
import { Role } from '../common/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @SwaggerRegisterCliente()
  @Post('register-cliente')
  registerCliente(@Body() dto: RegisterDTO): Promise<{ access_token: string }> {
    return this.service.register(dto, Role.CLIENTE);
  }

  @SwaggerRegisterEmpleado()
  @Post('register-empleado')
  registerEmpleado(
    @Body() dto: RegisterDTO,
  ): Promise<{ access_token: string }> {
    return this.service.register(dto, Role.EMPLEADO);
  }

  @SwaggerLogin()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDTO): Promise<{ access_token: string }> {
    return this.service.login(dto);
  }
}
