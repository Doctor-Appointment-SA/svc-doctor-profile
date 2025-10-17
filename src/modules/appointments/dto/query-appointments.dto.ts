import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAppointmentsDto {
  @ApiPropertyOptional({ description: 'กรองตาม doctor id' })
  @IsOptional() @IsUUID()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'กรองตาม patient id' })
  @IsOptional() @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ description: 'เช่น scheduled, completed, cancelled' })
  @IsOptional() @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'เริ่มตั้งแต่วันที่ (ISO 8601)' })
  @IsOptional() @IsISO8601()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'ถึงวันที่ (ISO 8601)' })
  @IsOptional() @IsISO8601()
  dateTo?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  take?: number = 20;

  @ApiPropertyOptional({ description: 'ใช้ cursor (id) จากหน้าก่อนหน้า' })
  @IsOptional()
  cursor?: string;
}
