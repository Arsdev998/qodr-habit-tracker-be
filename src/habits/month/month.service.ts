import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma_config/prisma.service';
import { CreateMonthDto,UpdateMonthDto } from '../dto/month.dto';
import { getDaysInMonth } from './date.utils';
import { days } from '@nestjs/throttler';

@Injectable()
export class MonthService {
  constructor(private readonly prisma: PrismaService) {}

  // Mengambil semua bulan
  async getAllMonths() {
    return this.prisma.month.findMany({
      include: {
        days: {
          include:{
            habitStatuses:true
          }
        },
        habitStatuses: {
          include: {
            habit: true, // Menyertakan data habit
          },
         
        },
      },
    });
  }
  // Menambahkan bulan baru
  async createMonth(data: CreateMonthDto) {
     const daysInMonth = 30
    const month = await this.prisma.month.create({
      data: {
        name: data.name,
        year: data.year,
        // Tambahkan logika untuk menambahkan hari
        days: {
          create: Array.from({ length: daysInMonth }, (_, index) => ({
            date: index + 1,
          })),
        },
      },
    });
    return month;
  }

  // Memperbarui bulan berdasarkan ID
  async updateMonth(id: number, updateMonthDto: UpdateMonthDto) {
    return this.prisma.month.update({
      where: { id },
      data: updateMonthDto,
    });
  }

  // Mengambil habit untuk bulan tertentu
  async getHabitsForMonth(monthId: number) {
    return this.prisma.habitStatus.findMany({
      where: { monthId },
      include: { habit: true }, // Menyertakan data habit
    });
  }
}
