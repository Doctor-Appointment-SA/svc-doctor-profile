import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMedicalRecordDto) {
    return this.prisma.medicalRecord.create({
      data: {
        patient_id: dto.patientId,
        doctor_id: dto.doctorId,
        diagnosis: dto.diagnosis,
        notes: dto.notes,
      },
    });
  }

  async findAll() {
    return this.prisma.medicalRecord.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }
}
