import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMedicalRecordBodyDto {
  @ApiPropertyOptional({ example: 'Influenza' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'ให้ยาลดไข้ พักผ่อน 2-3 วัน' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
