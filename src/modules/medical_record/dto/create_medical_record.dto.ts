import { IsUUID, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  patient_id: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  doctor_id: string;

  @ApiPropertyOptional({ example: 'Influenza' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'ให้ยาลดไข้ พักผ่อน 2-3 วัน' })
  @IsOptional()
  @IsString()
  notes?: string;

  // schema เป็น Int? → ถ้าจะให้ client ส่งมาได้ ใส่ validator ให้ชัด
  @ApiPropertyOptional({
    description: 'Unix epoch (milliseconds)',
    example: 1739892345123,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  createdAt?: number;
}
