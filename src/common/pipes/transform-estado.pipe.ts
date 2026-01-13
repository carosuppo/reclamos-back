import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Estados } from '@prisma/client';

@Injectable()
export class TransformEstadoPipe implements PipeTransform<string, Estados> {
  transform(value: string): Estados {
    const estado = value.toUpperCase();

    if (!Object.values(Estados).includes(estado as Estados)) {
      throw new BadRequestException(
        `El estado '${value}' no es válido. Valores permitidos: ${Object.values(
          Estados,
        ).join(', ')}`,
      );
    }

    return estado as Estados;
  }
}
