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
    return await this.prisma.$transaction(async (prisma) => {
      const { name, year } = createMonthDto;
      const monthIndex = new Date(`${name} 1, ${year}`).getMonth();
      const daysInMonth = getDaysInMonth(new Date(year, monthIndex));

      const daysData = Array.from({ length: daysInMonth }, (_, i) => ({
        date: i + 1,
      }));

      // Buat bulan beserta hari-harinya
      const newMonth = await prisma.month.create({
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

      // Ambil semua user dan habit dalam satu query
      const [users, habits] = await Promise.all([
        prisma.user.findMany(),
        prisma.habit.findMany({
          where: {
            userId: null,
          },
        }),
      ]);

      // Persiapkan data untuk bulk insert
      const habitStatusData = [];
      const BATCH_SIZE = 1000; // Sesuaikan dengan kebutuhan

      for (const user of users) {
        for (const habit of habits) {
          for (const day of newMonth.days) {
            habitStatusData.push({
              userId: user.id,
              habitId: habit.id,
              monthId: newMonth.id,
              dayId: day.id,
              status: false,
            });
          }
        }
      }

      // Bagi data menjadi batch-batch yang lebih kecil
      for (let i = 0; i < habitStatusData.length; i += BATCH_SIZE) {
        const batch = habitStatusData.slice(i, i + BATCH_SIZE);
        await prisma.habitStatus.createMany({
          data: batch,
        });
      }

      return newMonth;
    });
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
    // Hapus semua  yang terkait dengan month ini
    await this.prisma.day.deleteMany({
      where: {
        monthId: parseInt(monthId),
      },
    });
    await this.prisma.tilawah.deleteMany({
      where: {
        monthId: parseInt(monthId),
      },
    });
    await this.prisma.murajaah.deleteMany({
      where: {
        monthId: parseInt(monthId),
      },
    });
    await this.prisma.ziyadah.deleteMany({
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

  // get month by habit
  async getMonthWithHabitStatuses(monthId: string, userId: string) {
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
              orderBy: {
                id: 'desc',
              },
              where: {
                userId: parseInt(userId),
              },
              include: {
                habit: true,
              },
            },
          },
        },
      },
    });
    return monthWithDays; // Jika bulan tidak ditemukan
  }

  // get month by tilawah
  async getMonthByTilawah(monthId: string, userId: string) {
    const monthTilawah = this.prisma.month.findUnique({
      where: {
        id: parseInt(monthId),
      },
      include: {
        tilawah: {
          where: {
            userId: parseInt(userId),
          },
        },
      },
    });

    if (!monthTilawah) {
      throw new NotFoundException('NotFound');
    }
    return monthTilawah;
  }
  // GET MONTH BY MURAJA'AH
  async getMonthByMurajaah(monthId: string, userId: string) {
    const monthMurajaah = this.prisma.month.findUnique({
      where: {
        id: parseInt(monthId),
      },
      include: {
        murajaah: {
          where: {
            userId: parseInt(userId),
          },
        },
      },
    });

    if (!monthMurajaah) {
      throw new NotFoundException('NotFound');
    }
    return monthMurajaah;
  }
  // GET MONTH ZIYADAH
  async getMonthByZiyadah(monthId: string, userId: string) {
    const monthZiyadah = this.prisma.month.findUnique({
      where: {
        id: parseInt(monthId),
      },
      include: {
        ziyadah: {
          where: {
            userId: parseInt(userId),
          },
        },
      },
    });

    if (!monthZiyadah) {
      throw new NotFoundException('NotFound');
    }
    return monthZiyadah;
  }
  // GET MONTH JURNAL
  async getMonthByJurnal(monthId: string, userId: string) {
    const monthJurnal = this.prisma.month.findUnique({
      where: {
        id: parseInt(monthId),
      },
      include: {
        jurnal: {
          where: {
            userId: parseInt(userId),
          },
        },
      },
    });

    if (!monthJurnal) {
      throw new NotFoundException('NotFound');
    }
    return monthJurnal;
  }
}
