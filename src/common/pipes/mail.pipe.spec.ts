import { MailPipe } from './mail.pipe';
import { BadRequestException } from '@nestjs/common';

describe('MailPipe', () => {
  it('normaliza email', () => {
    const pipe = new MailPipe();

    const result = pipe.transform('  TEST@MAIL.COM ');

    expect(result).toBe('test@mail.com');
  });

  it('lanza error si no es string', () => {
    const pipe = new MailPipe();

    expect(() => pipe.transform(123 as never)).toThrow(BadRequestException);
  });

  it('lanza error si email invalido', () => {
    const pipe = new MailPipe();

    expect(() => pipe.transform('no-email')).toThrow(BadRequestException);
  });
});
