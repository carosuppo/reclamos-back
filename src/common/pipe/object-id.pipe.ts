import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  transform(id: string): string {
    if (typeof id !== 'string') {
      throw new BadRequestException('El ID debe ser un string.');
    }

    const objectIdRegex = /^[a-fA-F0-9]{24}$/;

    if (!objectIdRegex.test(id)) {
      throw new BadRequestException(
        `El valor '${id}' no es un ObjectId válido.`,
      );
    }

    return id;
  }
}
