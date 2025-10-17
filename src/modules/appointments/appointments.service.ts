import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}
  findAll() {
    return this.prisma.appointment.findMany({
      orderBy: { appoint_date: 'asc' },
      include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
    });
  }
  async findOne(id: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
    });
    if (!appt) throw new NotFoundException('Appointment not found');
    return appt;
  }
}
