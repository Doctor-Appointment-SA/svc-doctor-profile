import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  /**
   * หมายเหตุสำคัญจาก schema:
   * - doctor.id == user.id (relation @relation(fields: [id], references: [id]))
   * - ดังนั้น "doctorId" คือ UUID เดียวกับ user.id ของหมอ
   */
  async findOne(doctorId: string) {
    const doc = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        // user relation ตาม schema (ไม่มี email ใน user ของคุณ)
        user: { select: { name: true, lastname: true, username: true, phone: true, role: true } },
      },
    });

    if (!doc) throw new NotFoundException('Doctor not found');
    return doc; // คืนตาม shape ของ Prisma (user ชื่อ 'user' ตรง schema)
  }

  /**
   * ใช้ตอนมี auth: user.id ของ session == doctor.id
   */
  async findMe(userId: string) {
    return this.findOne(userId);
  }
}
