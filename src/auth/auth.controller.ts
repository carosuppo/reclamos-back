import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
/* eslint-disable prettier/prettier */

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-cliente')
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente registrado correctamente' })
  @ApiResponse({ status: 400, description: 'El email ya está en uso' })
  registrarCliente(
    @Body() registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    return this.authService.registerCliente(registerDto);
  }

  @Post('register-empleado')
  @ApiOperation({ summary: 'Registrar un nuevo empleado' })
  @ApiResponse({ status: 201, description: 'Empleado registrado correctamente' })
  @ApiResponse({ status: 400, description: 'El email ya está en uso' })
  registrarEmpleado(
    @Body() registerDto: RegisterDto
  ): Promise<{ access_token: string }> {
    return this.authService.registerEmpleado(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 400, description: 'Credenciales inválidas' })
  login(
    @Body() loginDto: LoginDto
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
