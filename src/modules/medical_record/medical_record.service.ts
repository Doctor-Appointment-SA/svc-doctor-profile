import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class MedicalRecordService {
  constructor(private prisma: PrismaService) {}

  /**
   * ดึงเวชระเบียนของคู่ (หมอ, คนไข้) — อาจเป็น null ถ้าไม่มี
   */
  getByDoctorPatient(doctor_id: string, patient_id: string) {
    return this.prisma.medical_record.findFirst({
      where: { doctor_id, patient_id },
      include: {
        patient: { select: { id: true } },
        doctor: { select: { id: true } },
      },
    });
  }

  /**
   * สร้างถ้ายังไม่มี / อัปเดตถ้ามีแล้ว (ไม่แก้ schema → ป้องกัน race ด้วย transaction)
   */
  async upsertByDoctorPatient(
    doctor_id: string,
    patient_id: string,
    dto: { diagnosis?: string; notes?: string },
    user_id: string,
  ) {
    // verfy owernership => user is the doctor of the appointment
    const found = (user_id === doctor_id)
    if (!found)
      throw new ForbiddenException('You do not own this prescription');

    // ตรวจ FK เบื้องต้นเพื่อ error เป็น 400/404 ที่อ่านง่าย (optional แต่ช่วยดีบั๊ก)
    await this.ensureDoctorAndPatientExist(doctor_id, patient_id);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const existing = await tx.medical_record.findFirst({
          where: { doctor_id, patient_id },
          select: { id: true },
        });

        if (existing) {
          // อัปเดตเฉพาะ field ที่ส่งมา
          return tx.medical_record.update({
            where: { id: existing.id },
            data: {
              diagnosis: dto.diagnosis ?? undefined,
              notes: dto.notes ?? undefined,
            },
          });
        }

        // สร้างใหม่ (createdAt เก็บเป็น "วินาที" เพราะ schema เป็น Int)
        return tx.medical_record.create({
          data: {
            id: randomUUID(),
            doctor_id,
            patient_id,
            diagnosis: dto.diagnosis ?? null,
            notes: dto.notes ?? null,
            createdAt: Math.floor(Date.now() / 1000),
          },
        });
      });
    } catch (e) {
      // map Prisma error ให้อ่านง่าย
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new BadRequestException(
            'doctor_id/patient_id violates FK (not found)',
          );
        }
      }
      throw e;
    }
  }

  private async ensureDoctorAndPatientExist(
    doctor_id: string,
    patient_id: string,
  ) {
    const [doc, pat] = await Promise.all([
      this.prisma.doctor.findUnique({
        where: { id: doctor_id },
        select: { id: true },
      }),
      this.prisma.patient.findUnique({
        where: { id: patient_id },
        select: { id: true },
      }),
    ]);
    if (!doc) throw new NotFoundException('doctor_id not found');
    if (!pat) throw new NotFoundException('patient_id not found');
  }
}
