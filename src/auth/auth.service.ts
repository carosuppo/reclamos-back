import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmpleadoService } from 'src/empleado/empleado.service';
import { ClienteService } from 'src/cliente/cliente.service';
import { ClienteDto } from 'src/cliente/dto/cliente.dto';
import { EmpleadoDto } from 'src/empleado/dto/empleado.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly empleadoService: EmpleadoService,
    private readonly jwtService: JwtService,
  ) {}
  async registerCliente(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    await this.validarEmailDisponible(registerDto.email);
    await this.transformarContraseña(registerDto);
    const cliente = await this.clienteService.register(registerDto);
    return this.firmarToken(cliente.id, 'CLIENTE');
  }

  async registerEmpleado(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    await this.validarEmailDisponible(registerDto.email);
    await this.transformarContraseña(registerDto);
    const empleado = await this.empleadoService.register(registerDto);
    return this.firmarToken(empleado.id, 'EMPLEADO');
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, contraseña } = loginDto;

    // 1. Buscar cliente
    const cliente = await this.clienteService.findOne(email);

    if (cliente) {
      // Validar contraseña del cliente
      const contraseñaValida = await this.validarContraseña(
        cliente,
        contraseña,
      );
      if (!contraseñaValida) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }

      return this.firmarToken(cliente.id, 'CLIENTE');
    }

    // 2. Buscar empleado
    const empleado = await this.empleadoService.findOne(email);

    if (empleado) {
      // Validar contraseña del empleado
      const contraseñaValida = await this.validarContraseña(
        empleado,
        contraseña,
      );
      if (!contraseñaValida) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }

      return this.firmarToken(empleado.id, 'EMPLEADO');
    }

    // 3. Si no se encontró en ninguna tabla
    throw new UnauthorizedException('Credenciales inválidas.');
  }

  private async validarContraseña(
    usuario: any,
    contraseñaPlana: string,
  ): Promise<boolean> {
    return await bcrypt.compare(contraseñaPlana, usuario.contraseña);
  }

  async validarEmailDisponible(email: string): Promise<void> {
    const existeCliente = await this.validarCliente(email);

    const existeEmpleado = await this.validarEmpleado(email);

    if (existeCliente != null || existeEmpleado != null) {
      throw new BadRequestException('El email ya está en uso.');
    }
  }

  async validarCliente(email: string): Promise<ClienteDto | null> {
    const existeCliente = await this.clienteService.findOne(email);
    return existeCliente;
  }

  async validarEmpleado(email: string): Promise<EmpleadoDto | null> {
    const existeEmpleado = await this.empleadoService.findOne(email);
    return existeEmpleado;
  }

  async transformarContraseña(registerDtoDto: RegisterDto): Promise<void> {
    const hash = await bcrypt.hash(registerDtoDto.contraseña, 10);
    registerDtoDto.contraseña = hash;
  }

  private async firmarToken(
    id: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
