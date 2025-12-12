import { Controller } from '@nestjs/common';
import { CambioEstadoService } from './cambio-estado.service';

@Controller('cambio-estado')
export class CambioEstadoController {
  constructor(private readonly cambioEstadoService: CambioEstadoService) {}
}
