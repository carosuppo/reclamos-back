import { ObjectIdPipe } from './object-id.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ObjectIdPipe', () => {
  it('permite un ObjectId valido', () => {
    const pipe = new ObjectIdPipe();

    const value = '507f1f77bcf86cd799439011';
    const result = pipe.transform(value);

    expect(result).toBe(value);
  });

  it('lanza error si no es ObjectId valido', () => {
    const pipe = new ObjectIdPipe();

    expect(() => pipe.transform('x')).toThrow(BadRequestException);
  });
});
