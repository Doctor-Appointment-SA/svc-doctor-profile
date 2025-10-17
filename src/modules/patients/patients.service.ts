import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.patient.findMany({ include: { user: true } }); }
  async byId(id: string) {
    const p = await this.prisma.patient.findUnique({ where: { id }, include: { user: true } });
    if (!p) throw new NotFoundException('Patient not found');
    return p;
  }
}
