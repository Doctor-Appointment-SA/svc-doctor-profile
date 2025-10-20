// src/modules/doctor/doctor.controller.ts
import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /doctor/:id  -> ใช้ param ตรง ๆ ไม่แตะ req.user
   */
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const doc = await this.prisma.doctor.findUnique({
      where: { id },
      include: { user: true }, // ชื่อ/สกุลหมอมาจาก user
    });
    if (!doc) throw new NotFoundException('Doctor not found');
    return doc;
  }

  /**
   * GET /doctor/me  -> ใช้เมื่อระบบ auth พร้อม (มี req.user)
   * กัน null อย่างรัดกุม เพื่อไม่ให้ "reading 'doctor' of undefined"
   */
  @Get('me')
  async getMe(@Req() req: any) {
    const userId: string | undefined = req?.user?.id ?? req?.user?.sub ?? undefined;
    if (!userId) throw new NotFoundException('No logged-in user');

    // ใน schema ตอนนี้ doctor.id == user.id
    const doc = await this.prisma.doctor.findUnique({
      where: { id: userId },
      include: { user: true },
    });
    if (!doc) throw new NotFoundException('Doctor profile not found');
    return doc;
  }
}
