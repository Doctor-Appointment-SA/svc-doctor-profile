// src/modules/appointments/appointments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}


  async list(q: QueryAppointmentsDto) {
    const { doctorId, patientId, status, dateFrom, dateTo, take = 20, cursor } = q;

    const where: any = {
      ...(doctorId ? { doctor_id: doctorId } : {}),
      ...(patientId ? { patient_id: patientId } : {}),
      ...(status ? { status } : {}),
    };

    // ฟิลเตอร์ช่วงเวลา appoint_date
    if (dateFrom || dateTo) {
      where.appoint_date = {
        ...(dateFrom ? { gte: toDate(dateFrom) } : {}),
        ...(dateTo ? { lte: toDate(dateTo) } : {}),
      };
    }

    return this.prisma.appointment.findMany({
      where,
      orderBy: { appoint_date: 'asc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        // doctor มี relation ไป user ตรงๆ ตาม schema ของคุณ
        doctor: {
          include: {
            user: true,
          },
        },
        // patient ไม่มี field user โดยตรง ต้องใช้ relation name: user_patient_idTouser
        patient: {
          include: {
            user_patient_idTouser: true,
            // ถ้าต้องการด้วย: user_patient_hospital_numberTouser: true,
          },
        },
      },
    });
  }

  /**
   * รายละเอียดรายการนัดตาม id (GET /appointments/:id)
   */
  async byId(id: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: {
          include: {
            user_patient_idTouser: true,
            // user_patient_hospital_numberTouser: true,
          },
        },
      },
    });

    if (!appt) {
      throw new NotFoundException('Appointment not found');
    }
    return appt;
  }
}

/** แปลง string → Date แบบปลอดภัย (ถ้าไม่ใช่ ISO ที่ถูกต้องจะโยน error) */
function toDate(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${iso}`);
  }
  return d;
}
