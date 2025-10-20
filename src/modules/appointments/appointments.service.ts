// src/modules/appointments/appointments.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: QueryAppointmentsDto) {
    const {
      doctorId,
      patientId,
      status,
      dateFrom,
      dateTo,
      take: takeIn = 20,
      cursor,
    } = q;

    // แปลง string → enum (ตาม schema: PENDING | CONFIRMED | COMPLETE | CANCEL)
    const statusEnum: AppointmentStatus | undefined =
      status &&
      Object.values(AppointmentStatus).includes(status as AppointmentStatus)
        ? (status as AppointmentStatus)
        : undefined;

    const where: Prisma.appointmentWhereInput = {
      ...(doctorId ? { doctor_id: doctorId } : {}),
      ...(patientId ? { patient_id: patientId } : {}),
      ...(statusEnum ? { status: statusEnum } : {}),
    };

    if (dateFrom || dateTo) {
      where.appoint_date = {
        ...(dateFrom ? { gte: toDate(dateFrom) } : {}),
        ...(dateTo ? { lte: toDate(dateTo) } : {}),
      };
    }

    const take = Number.isFinite(takeIn) ? takeIn : 20;

    return this.prisma.appointment.findMany({
      where,
      // deterministic ordering สำหรับ cursor pagination
      orderBy: [{ appoint_date: 'asc' }, { id: 'asc' }],
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user_patient_idTouser: true } },
      },
    });
  }

  async byId(appointment_id: string, user_id: string) {
    // verify ownership first
    // const role = 'doctor';
    const doctor_id = user_id;

    const found = await this.prisma.appointment.findFirst({
      where: { doctor_id: doctor_id },
      select: { id: true },
    });
    if (!found)
      throw new ForbiddenException('You do not own this prescription');

    const appt = await this.prisma.appointment.findUnique({
      where: { id: appointment_id },
      include: {
        doctor: {
          include: { user: true }, // เผื่อใช้ชื่อหมอในหน้า detail
        },
        patient: {
          include: {
            user_patient_idTouser: {
              select: {
                name: true,
                lastname: true,
                id_card: true,
                phone: true,
              },
            },
          },
        },
      },
    });
    if (!appt) throw new NotFoundException('Appointment not found');
    return appt;
  }
}

// helper: แปลง string → Date แบบปลอดภัย
function toDate(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${iso}`);
  }
  return d;
}
