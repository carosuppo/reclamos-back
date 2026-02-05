import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AreaValidator } from '../area/validators/area.validator';
import { RegisterDTO } from '../auth/dtos/register.dto';
import { AuthValidator } from '../auth/validators/auth.validator';
import { AuthDTO } from '../common/dtos/auth.dto';
import { AsignarAreaDTO } from './dtos/asignar-area.dto';
import { EmpleadoDTO } from './dtos/empleado.dto';
import { UpdateEmpleadoDTO } from './dtos/update-empleado.dto';
import { EmpleadoMapper as mapper } from './mappers/empleado.mapper';
import type { IEmpleadoRepository } from './repositories/empleado.repository.interface';
import { EmpleadoValidator } from './validators/empleado.validator';

@Injectable()
export class EmpleadoService {
  constructor(
    @Inject('IEmpleadoRepository')
    private readonly repository: IEmpleadoRepository,
    private readonly validator: EmpleadoValidator,
    @Inject(forwardRef(() => AuthValidator))
    private readonly authValidator: AuthValidator,
    private readonly areaValidator: AreaValidator,
  ) {}

  async create(dto: RegisterDTO): Promise<EmpleadoDTO> {
    // Mapea al formato esperado por el repositorio
    const data = mapper.toEmpleadoEntity(dto);

    const empleado = await this.repository.create(data);
    // Mapea la respuesta a formato DTO
    return mapper.toEmpleadoDTO(empleado);
  }

  async update(id: string, dto: UpdateEmpleadoDTO): Promise<boolean> {
    // Valida existencia del empleado
    await this.validator.validate(id);

    if (dto.email) {
      // Valida si no existe otro usuario con el mismo email
      await this.authValidator.validateEmail(dto.email);
    }

    // Mapea al formato esperado por el repositorio
    const data = mapper.toEmpleadoUpdateData(id, dto);

    await this.repository.update(data);
    return true;
  }

  async assignArea(id: string, dto: AsignarAreaDTO): Promise<boolean> {
    // Valida existencia del empleado
    await this.validator.validate(id);

    // Valida existencia del área
    await this.areaValidator.validate(dto.areaId);

    await this.repository.assignArea(id, dto.areaId);
    return true;
  }

  async findByEmail(email: string): Promise<EmpleadoDTO> {
    const empleado = await this.repository.findByEmail(email);

    if (!empleado) {
      throw new NotFoundException('No se encontró el empleado.');
    }

    // Mapea la respuesta a formato DTO
    return mapper.toEmpleadoDTO(empleado);
  }

  async findForAuth(email: string): Promise<AuthDTO | null> {
    const empleado = await this.repository.findByEmail(email);

    if (empleado) {
      // Mapear la respuesta a formato DTO
      return mapper.toAuthEmpleadoDTO(empleado);
    }

    // Debe devolver null y no tirar error, porque sino el método del login no funcionaría correctamente
    return null;
  }

  async findById(id: string): Promise<EmpleadoDTO> {
    const empleado = await this.repository.findById(id);

    if (!empleado) {
      throw new NotFoundException('No se encontró el empleado.');
    }

    // Mapea la respuesta a formato DTO
    return mapper.toEmpleadoDTO(empleado);
  }

  async findAreaById(id: string): Promise<string> {
    const empleado = await this.findById(id);

    if (!empleado) {
      throw new NotFoundException('No se encontró el empleado.');
    }

    // Mapea la respuesta a formato DTO
    return empleado.area;
  }
}
