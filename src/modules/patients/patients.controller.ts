import { Controller, Get, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly service: PatientsService) {}
  @Get() list() { return this.service.list(); }
  @Get(':id') byId(@Param('id') id: string) { return this.service.byId(id); }
}
