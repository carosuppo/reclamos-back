/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { EmpleadoService } from 'src/empleado/empleado.service';
import { ClienteService } from 'src/cliente/cliente.service';
import { ClienteDto } from 'src/cliente/dtos/cliente.dto';
import { EmpleadoDto } from 'src/empleado/dtos/empleado.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/role.enum';

type BcryptTyped = {
  hash: (data: string | Buffer, saltOrRounds: number | string) => Promise<string>;
  compare: (data: string | Buffer, encrypted: string) => Promise<boolean>;
};

const bcryptSafe = bcrypt as unknown as BcryptTyped;

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
    return this.firmarToken(cliente.id, Role.CLIENTE);
  }

  async registerEmpleado(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    await this.validarEmailDisponible(registerDto.email);
    await this.transformarContraseña(registerDto);
    const empleado = await this.empleadoService.register(registerDto);
    return this.firmarToken(empleado.id, Role.EMPLEADO);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
  const { email, contraseña } = loginDto;

  // 1. Buscar cliente
  const cliente = await this.clienteService.findForAuth(email);

  if (cliente) {
    const contraseñaValida = await this.validarContraseña(
      cliente.contraseña,
      contraseña
    );

    if (!contraseñaValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return this.firmarToken(cliente.id, cliente.role);
  }

  // 2. Buscar empleado
  const empleado = await this.empleadoService.findForAuth(email);

  if (empleado) {
    const contraseñaValida = await this.validarContraseña(
      empleado.contraseña,
      contraseña
    );

    if (!contraseñaValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return this.firmarToken(empleado.id, empleado.role);
  }

  // 3. No existe en ninguna tabla
  throw new UnauthorizedException('Credenciales inválidas.');
}


  private async validarContraseña(
    contraseñaHash: string,
    contraseñaPlana: string
  ): Promise<boolean> {
    try {
      return await bcryptSafe.compare(contraseñaPlana, contraseñaHash);
    } catch {
      // If comparing fails for any reason, treat as invalid password
      return false;
    }
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

  private async transformarContraseña(registerDto: RegisterDto): Promise<void> {
    registerDto.contraseña = await bcryptSafe.hash(registerDto.contraseña, 10);
  }

  async firmarToken(
    id: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
