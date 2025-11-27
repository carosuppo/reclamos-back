import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateClienteDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
