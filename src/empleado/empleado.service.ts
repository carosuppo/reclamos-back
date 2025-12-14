import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { EmpleadoRepository } from './repositories/empleado.repository';
import { toEmpleadoDto } from './mappers/toEmpleadoDto.mapper';
import { EmpleadoDto } from './dtos/empleado.dto';
import { UpdateEmpleadoDto } from './dtos/update.empleado.dto';
import { toEmpleadoUpdateData } from './mappers/toEmpleadoParcial.mapper';
import { AuthDto } from 'src/common/dtos/auth.dto';
import { AuthMapper } from 'src/common/mappers/toAuthDto.mapper';
import { AsignarAreaDto } from './dtos/asignar.area.dto';
import { AreaService } from 'src/area/area.service';
import { Role } from 'src/common/enums/role.enum';
import { toEmpleadoEntity } from './mappers/toEmpleadoEntity.mapper';

@Injectable()
export class EmpleadoService {
  constructor(
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly areaService: AreaService,
  ) {}

  async register(registerDto: RegisterDto): Promise<EmpleadoDto> {
    try {
      const data = toEmpleadoEntity(registerDto);
      const empleado = await this.empleadoRepository.create(data);
      return toEmpleadoDto(empleado);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al crear el empleado: ${error.message}`);
      }
      throw new Error('Error al crear el empleado: error desconocido');
    }
  }

  async update(id: string, dto: UpdateEmpleadoDto) {
    const existing = await this.empleadoRepository.findById(id);
    if (!existing) {
      throw new BadRequestException('El usuario no existe.');
    }

    if (dto.email) {
      const emailInUse = await this.empleadoRepository.findByEmail(dto.email);
      if (emailInUse && emailInUse.id !== id) {
        throw new BadRequestException('El email ya está en uso.');
      }
    }

    const updatedData = toEmpleadoUpdateData(dto);
    return this.empleadoRepository.update(id, updatedData);
  }

  async findOne(email: string): Promise<EmpleadoDto | null> {
    const empleado = await this.empleadoRepository.findByEmail(email);
    if (!empleado) {
      return null;
    }
    return toEmpleadoDto(empleado);
  }

  remove(id: number) {
    return `This action removes a #${id} empleado`;
  }

  async findForAuth(email: string): Promise<AuthDto | null> {
    const empleado = await this.empleadoRepository.findByEmail(email);
    if (empleado) {
      return AuthMapper.toAuthDto(empleado, Role.EMPLEADO);
    }
    return null;
  }

  async asignarArea(email: string, dto: AsignarAreaDto): Promise<EmpleadoDto> {
    const areaDto = await this.areaService.findByName(dto.area);
    if (!areaDto) {
      throw new BadRequestException('El area no existe.');
    }

    const empleado = await this.empleadoRepository.asignarArea(
      email,
      areaDto.id,
    );
    return toEmpleadoDto(empleado);
  }
}
