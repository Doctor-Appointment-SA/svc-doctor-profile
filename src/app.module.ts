import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PatientsModule } from './modules/patients/patients.module';
import { MedicalRecordModule } from './modules/medical_record/medical_record.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AppointmentsModule,
    PatientsModule,
    MedicalRecordModule,
    DoctorModule,
    ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
    AuthModule,
  ],
})
export class AppModule {}
