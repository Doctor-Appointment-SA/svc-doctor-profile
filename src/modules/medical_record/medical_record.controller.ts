import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MedicalRecordService } from './medical_record.service';
import { UpdateMedicalRecordBodyDto } from './dto/update_medical_record_body.dto';

@ApiTags('medical_record')
@Controller('medical_record')
export class MedicalRecordController {
  constructor(private readonly svc: MedicalRecordService) {}

  /**
   * ดึง medical record ของคู่ (หมอ, คนไข้)
   * GET /medical_record/of/:doctorId/:patientId
   */
  @Get('of/:doctorId/:patientId')
  @ApiOkResponse({ description: 'Medical record for this doctor-patient pair (404 if none).' })
  async getOf(
    @Param('doctorId', new ParseUUIDPipe({ version: '4' })) doctorId: string,
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
  ) {
    const rec = await this.svc.getByDoctorPatient(doctorId, patientId);
    if (!rec) throw new NotFoundException('No record for this doctor-patient pair');
    return rec;
  }

  /**
   * สร้างถ้ายังไม่มี / อัปเดตถ้ามีแล้ว (upsert-like)
   * PUT /medical_record/of/:doctorId/:patientId
   * body: { diagnosis?, notes? }
   */
  @Put('of/:doctorId/:patientId')
  @ApiOkResponse({ description: 'Created or updated medical record for the pair.' })
  async putOf(
    @Param('doctorId', new ParseUUIDPipe({ version: '4' })) doctorId: string,
    @Param('patientId', new ParseUUIDPipe({ version: '4' })) patientId: string,
    @Body() dto: UpdateMedicalRecordBodyDto,
  ) {
    return this.svc.upsertByDoctorPatient(doctorId, patientId, dto);
  }
}
