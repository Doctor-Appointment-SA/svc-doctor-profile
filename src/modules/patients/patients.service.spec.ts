// src/modules/patients/patients.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.patient.findMany({
      include: {
        user_patient_idTouser: true,
        user_patient_hospital_numberTouser: true,
      },
    });
  }

  async get(id: string) {
    const p = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        user_patient_idTouser: true,
        user_patient_hospital_numberTouser: true,
      },
    });
    if (!p) throw new NotFoundException('Patient not found');
    return p;
  }
}
