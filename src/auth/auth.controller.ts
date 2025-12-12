import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  SwaggerLogin,
  SwaggerRegisterCliente,
  SwaggerRegisterEmpleado,
} from './swaggers/auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SwaggerRegisterCliente()
  @Post('register-cliente')
  registrarCliente(
    @Body() registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    return this.authService.registerCliente(registerDto);
  }

  @SwaggerRegisterEmpleado()
  @Post('register-empleado')
  registrarEmpleado(
    @Body() registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    return this.authService.registerEmpleado(registerDto);
  }

  @SwaggerLogin()
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
