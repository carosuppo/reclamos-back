import { TransformEstadoPipe } from './transform-estado.pipe';
import { BadRequestException } from '@nestjs/common';
import { Estados } from '@prisma/client';

describe('TransformEstadoPipe', () => {
  it('convierte a enum Estados', () => {
    const pipe = new TransformEstadoPipe();

    const result = pipe.transform('pendiente');

    expect(result).toBe(Estados.PENDIENTE);
  });

  it('lanza error si no es valido', () => {
    const pipe = new TransformEstadoPipe();

    expect(() => pipe.transform('otro')).toThrow(BadRequestException);
  });
});
