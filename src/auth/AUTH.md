Tanto los registers como el login devuelven un token (JWT).

Para implementarlos en un endpoint, se ponen los siguientes decoradores ANTES del endpoint:

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROL')

Por ejemplo:

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Get('mis-turnos')
  getTurnos() {
    return 'Turnos del cliente';
  }

También se pueden incluir directamente sobre el controller si todos los endpoints serán accesibles para el mismo rol:

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @Controller('loquesea')
  export class AlgoController {
    // Todos estos endpoints ya quedan protegidos
    @Get()
    findAll() { ... }
  
    @Post()
    create() { ... }
  }

  En el .env tienen que poner un JWT_SECRET="con el texto que quieran"