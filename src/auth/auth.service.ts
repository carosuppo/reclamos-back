import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClienteService } from '../cliente/cliente.service';
import { Role } from '../common/enums/role.enum';
import { EmpleadoService } from '../empleado/empleado.service';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';
import { AuthHelper } from './helpers/auth.helper';
import { AuthValidator } from './validators/auth.validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly empleadoService: EmpleadoService,
    private readonly validator: AuthValidator,
    private readonly helper: AuthHelper,
  ) {}
  async register(
    dto: RegisterDTO,
    rol: Role,
  ): Promise<{ access_token: string }> {
    // Validar si el mail ya existe
    await this.validator.validateEmail(dto.email);

    // Registrar usuario dependiendo del rol traído del controlador
    return this.helper.register(dto, rol);
  }

  async login(dto: LoginDTO): Promise<{ access_token: string }> {
    // 1. Buscar el mail como cliente
    const cliente = await this.clienteService.findForAuth(dto.email);

    if (cliente) {
      // 1.2 Loguear como cliente
      return await this.helper.login(
        cliente.id,
        dto.email,
        dto.contraseña,
        cliente.contraseña,
        Role.CLIENTE,
      );
    }

    // 2. Buscarlo como empleado en caso de no encontrarlo como cliente
    const empleado = await this.empleadoService.findForAuth(dto.email);

    if (empleado) {
      // 2.2 Loguear como empleado
      return await this.helper.login(
        empleado.id,
        dto.email,
        dto.contraseña,
        empleado.contraseña,
        Role.EMPLEADO,
      );
    }

    // 3. Al no existir en ninguna tabla, lanzar error
    throw new UnauthorizedException('Credenciales inválidas.');
  }
}
