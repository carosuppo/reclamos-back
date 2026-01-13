import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class MailPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('El email debe ser un texto');
    }

    const email = value.trim().toLowerCase();

    if (!isEmail(email)) {
      throw new BadRequestException(
        `El email '${value}' no tiene un formato válido`,
      );
    }

    return email;
  }
}
