import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma_config/prisma.service';
import { CreateMonthDto, UpdateMonthDto } from '../dto/month.dto';
import { getDaysInMonth } from 'date-fns';
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
    const { name, year } = createMonthDto;

    const monthIndex = new Date(`${name} 1, ${year}`).getMonth();
    const daysInMonth = getDaysInMonth(new Date(year, monthIndex));

    const daysData = Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
    }));

    // Buat bulan beserta hari-harinya
    const newMonth = await this.prisma.month.create({
      data: {
        name,
        year,
        days: {
          create: daysData,
        },
      },
      include: {
        days: true,
      },
    });

    const users = await this.prisma.user.findMany();
    const habits = await this.prisma.habit.findMany();

    // Loop untuk setiap user
    for (const user of users) {
      // Loop untuk setiap habit
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

  // Memperbarui bulan berdasarkan ID
  async updateMonth(id: string, updateMonthDto: UpdateMonthDto) {
    const month = await this.prisma.month.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!month) {
      throw new NotFoundException('Month Not Found');
    }
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
    // Ambil semua habit
    const allHabits = await this.prisma.habit.findMany();

    // Ambil bulan berdasarkan monthId
    const monthWithDays = await this.prisma.month.findUnique({
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
              where: {
                userId: parseInt(userId), // Ambil status hanya untuk user ini
              },
              include: {
                habit: true,
              },
            },
          },
        },
      },
    });

    // Gabungkan data habit dengan habitStatuses
    if (monthWithDays) {
      const daysWithHabitStatuses = monthWithDays.days.map((day) => {
        // Gabungkan habit global dengan status user
        const habitsWithStatus = allHabits.map((habit) => {
          const status = day.habitStatuses.find(
            (habitStatus) => habitStatus.habitId === habit.id,
          );
          return {
            ...habit,
            status: status ? status.status : false, // Status habit jika ada, atau false jika tidak ada
          };
        });
        return {
          ...day,
          habitStatuses: habitsWithStatus, // Ganti dengan habit yang terhubung dengan user
        };
      });

      return {
        ...monthWithDays,
        days: daysWithHabitStatuses,
      };
    }
    return null; // Jika bulan tidak ditemukan
  }
}
