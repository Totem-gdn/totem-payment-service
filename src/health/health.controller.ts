import { Controller, Get, Header } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @Header('Cache-Control', 'none')
  health() {
    return {};
  }
}
