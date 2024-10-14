import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma_config/prisma.service';
import { CreateMonthDto, UpdateMonthDto } from '../dto/month.dto';
import { getDaysInMonth } from './date.utils';
import { days } from '@nestjs/throttler';

@Injectable()
export class MonthService {
  constructor(private readonly prisma: PrismaService) {}

  // Mengambil semua bulan
  async getAllMonths() {
    return this.prisma.month.findMany();
  }

  // get month by id
  async getMonthById(id: string) {
    return this.prisma.month.findUnique({
      where: { id: parseInt(id) },
      include: {
        days: {
          include: {
            habitStatuses: {
              include: {
                habit: true, // Mengambil nama habit
                user: true, // Jika ingin mengetahui siapa yang mengisi status habit
              },
            },
          },
        },
      },
    });
  }
  // Menambahkan bulan baru
  async createMonth(createMonthDto: CreateMonthDto) {
    const { name, year, days } = createMonthDto;

    // Buat array of Day objects dengan properti date dan dayNumber
    const daysData = Array.from({ length: days }, (_, i) => ({
      date: i + 1, // Pastikan menggunakan Int untuk field 'date'
    }));

    // Buat bulan beserta hari-harinya
    const newMonth = await this.prisma.month.create({
      data: {
        name,
        year,
        days: {
          create: daysData, // Membuat days dengan properti date dan dayNumber
        },
      },
      include: {
        days: true, // Sertakan hari-hari yang baru saja dibuat dalam hasil
      },
    });

    const users = await this.prisma.user.findMany();
    const habits = await this.prisma.habit.findMany();

    // Loop untuk setiap user dan habit
    for (const user of users) {
      for (const habit of habits) {
        // Loop untuk setiap hari yang telah dibuat
        for (const day of newMonth.days) {
          // Ambil day yang sudah ada dengan id yang digenerate
          await this.prisma.habitStatus.create({
            data: {
              userId: user.id,
              habitId: habit.id,
              monthId: newMonth.id,
              dayId: day.id, // Assign ID hari yang sesuai
              status: false, // Default ke false
            },
          });
        }
      }
    }

    return newMonth;
  }

  // Helper untuk mendapatkan indeks bulan dari nama bulan
  private getMonthIndex(monthName: string): number {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames.indexOf(monthName); // Mengembalikan indeks bulan (0-11)
  }

  // Memperbarui bulan berdasarkan ID
  async updateMonth(id: string, updateMonthDto: UpdateMonthDto) {
    return this.prisma.month.update({
      where: { id: parseInt(id) },
      data: {
        name: updateMonthDto.name,
        year: updateMonthDto.year,
      },
    });
  }

  // Mengambil habit untuk bulan tertentu
  async getHabitsForMonth(monthId: number) {
    return this.prisma.habitStatus.findMany({
      where: { monthId },
      include: { habit: true }, // Menyertakan data habit
    });
  }

  async deleteMonth(monthId: string) {
    const month = await this.prisma.month.findUnique({
      where: {
        id: parseInt(monthId),
      },
    });
    if (!month) {
      throw new NotFoundException('Month Not Found');
    }
    // Hapus semua days yang terkait dengan month ini
    await this.prisma.day.deleteMany({
      where: {
        monthId: parseInt(monthId),
      },
    });
    // Setelah days dihapus, hapus bulan
    const deleteMonthById = await this.prisma.month.delete({
      where: {
        id: parseInt(monthId),
      },
    });

    return deleteMonthById;
  }

  async getMonthWithHabitStatuses(monthId: string, userId: string) {
    return this.prisma.month.findUnique({
      where: {
        id: parseInt(monthId),
      },
      include: {
        days: {
          orderBy: {
            id: 'asc',
          },
          include: {
            habitStatuses: {
              orderBy: {
                id: 'asc',
              },
              where: {
                userId: parseInt(userId), // Filter by user to get their specific habit status
              },
              include: {
                habit: true, // Include the habit details
              },
            },
          },
        },
      },
    });
  }
}
