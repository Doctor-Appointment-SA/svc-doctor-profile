import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  // ตัวอย่าง seed คร่าว ๆ
  const userP = await prisma.user.create({ data: {
    username: 'p001', password: 'hashed', name: 'คนไข้', lastname: '001', role: 'patient'
  }});
  const userD = await prisma.user.create({ data: {
    username: 'd001', password: 'hashed', name: 'หมอ', lastname: 'A', role: 'doctor'
  }});
  const patient = await prisma.patient.create({ data: { user_id: userP.id, hospital_number: 'HN-0001' }});
  const doctor = await prisma.doctor.create({ data: { user_id: userD.id, specialty: 'ENT' }});
  await prisma.appointment.create({ data: {
    patient_id: patient.id, doctor_id: doctor.id, appoint_date: new Date('2025-12-15T10:30:00Z'), status: 'scheduled'
  }});
}
main().finally(() => prisma.$disconnect());
