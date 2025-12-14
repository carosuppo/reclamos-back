import { IsString } from "class-validator";

export class ReasignarAreaDto {
  @IsString()
  descripcion: string;
  @IsString()
  areaId: string;
}
