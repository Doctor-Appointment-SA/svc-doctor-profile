import { Module } from '@nestjs/common';
import { MedicalRecordController } from './medical_record.controller';
import { MedicalRecordService } from './medical_record.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService, PrismaService],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
