import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Get()
  list(@Query() q: QueryAppointmentsDto) {
    return this.service.list(q);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  byId(@Param('id') id: string, @Req() req:Request) {
    const user:any = req.user;
    const user_id = user.sub;
    console.log("user_id", user_id);
    console.log("id", id);
    return this.service.byId(id, user_id);
  }
}
