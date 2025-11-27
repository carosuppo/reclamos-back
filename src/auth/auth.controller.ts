import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-cliente')
  registrarCliente(
    @Body() registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    return this.authService.registerCliente(registerDto);
  }

  @Post('register-empleado')
  registrarEmpleado(
    @Body() registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    return this.authService.registerEmpleado(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get('mis-turnos')
  getTurnos() {
    return 'Turnos del cliente';
  }
}
