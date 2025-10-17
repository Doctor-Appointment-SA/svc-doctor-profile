import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async list(q: QueryAppointmentsDto) {
    const { doctorId, patientId, status, dateFrom, dateTo, take = 20, cursor } = q;

    return this.prisma.appointment.findMany({
      where: {
        ...(doctorId ? { doctor_id: doctorId } : {}),
        ...(patientId ? { patient_id: patientId } : {}),
        ...(status ? { status } : {}),
        ...(dateFrom || dateTo
          ? {
              appoint_date: {
                ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
                ...(dateTo ? { lte: new Date(dateTo) } : {}),
              },
            }
          : {}),
      },
      orderBy: { appoint_date: 'asc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
    });
  }

  async byId(id: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
    });
    if (!appt) throw new NotFoundException('Appointment not found');
    return appt;
  }
}
