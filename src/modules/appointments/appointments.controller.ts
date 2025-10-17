import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Get()
  list(@Query() q: QueryAppointmentsDto) {
    return this.service.list(q);
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.service.byId(id);
  }
}
