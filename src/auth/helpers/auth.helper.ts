import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClienteService } from '../../cliente/cliente.service';
import { ClienteDTO } from '../../cliente/dtos/cliente.dto';
import { Role } from '../../common/enums/role.enum';
import { EmpleadoDTO } from '../../empleado/dtos/empleado.dto';
import { EmpleadoService } from '../../empleado/empleado.service';
import { RegisterDTO } from '../dtos/register.dto';

type BcryptTyped = {
  hash: (
    data: string | Buffer,
    saltOrRounds: number | string,
  ) => Promise<string>;
  compare: (data: string | Buffer, encrypted: string) => Promise<boolean>;
};

const bcryptSafe = bcrypt as unknown as BcryptTyped;

@Injectable()
export class AuthHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly empleadoService: EmpleadoService,
    private readonly clienteService: ClienteService,
  ) {}

  async register(
    dto: RegisterDTO,
    rol: Role,
  ): Promise<{ access_token: string }> {
    // Hashear la contraseña
    await this.transformarContraseña(dto);

    // Registrar el usuario dependiendo el rol
    let user: EmpleadoDTO | ClienteDTO;
    if (rol === Role.EMPLEADO) {
      user = await this.empleadoService.create(dto);
    } else {
      user = await this.clienteService.create(dto);
    }

    // Devolver el token del usuario registrado
    return this.firmarToken(user.id, rol);
  }

  async login(
    usuarioId: string, // ID usuario
    contraseñaDTO: string, // Contraseña ingresada por el usuario
    contraseñaUsuario: string, // Contraseña almacenada en la base de datos
    rol: Role, // Rol del usuario
  ): Promise<{ access_token: string }> {
    // Valida coincidencia entre las contraseñas
    await this.validarContraseña(contraseñaUsuario, contraseñaDTO);
    // Devuelve el token
    return this.firmarToken(usuarioId, rol);
  }

  async transformarContraseña(dto: RegisterDTO): Promise<void> {
    dto.contraseña = await bcryptSafe.hash(dto.contraseña, 10);
  }

  async validarContraseña(
    contraseñaHash: string,
    contraseñaPlana: string,
  ): Promise<boolean> {
    const isValid = await bcryptSafe.compare(contraseñaPlana, contraseñaHash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return isValid;
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
