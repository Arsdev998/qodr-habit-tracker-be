import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import {
  CreateHabitDto,
  UpdateHabitDto,
  UpdateHabitStatusDto,
} from '../dto/habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  //get all habits
  async getAllHabits() {
    return this.prisma.habit.findMany({
      where: {
        userId: null,
      },
    });
  }
  //   create habits
  async createhabit(habitData: CreateHabitDto) {
    const newHabit = await this.prisma.habit.create({
      data: {
        title: habitData.title,
        maxDays: habitData.maxDays,
      },
    });

    const users = await this.prisma.user.findMany();
    const months = await this.prisma.month.findMany({
      include: {
        days: true,
      },
    });

    const BATCH_SIZE = 1000;
    const habitStatusData = [];

    for (const user of users) {
      for (const month of months) {
        for (const day of month.days) {
          habitStatusData.push({
            userId: user.id,
            habitId: newHabit.id,
            monthId: month.id,
            dayId: day.id,
            status: false,
          });

          // Jika batch size tercapai, lakukan insert
          if (habitStatusData.length >= BATCH_SIZE) {
            await this.prisma.habitStatus.createMany({
              data: habitStatusData,
            });
            habitStatusData.length = 0; // Reset array
          }
        }
      }
    }

    // Insert sisa data
    if (habitStatusData.length > 0) {
      await this.prisma.habitStatus.createMany({
        data: habitStatusData,
      });
    }

    return newHabit;
  }

  async createHabitByUser(
    monthId: string,
    userId: string,
    habitData: CreateHabitDto,
  ) {
    const newHabit = await this.prisma.habit.create({
      data: {
        title: habitData.title,
        maxDays: habitData.maxDays,
        userId: parseInt(userId),
      },
    });

    // Ambil semua hari dari bulan yang diberikan
    const daysInMonth = await this.prisma.month.findUnique({
      where: { id: parseInt(monthId) },
      include: { days: true },
    });
    // Loop untuk setiap hari dan buat habit status untuk habit yang baru ditambahkan
    for (const day of daysInMonth.days) {
      await this.prisma.habitStatus.create({
        data: {
          userId: parseInt(userId),
          habitId: newHabit.id,
          monthId: parseInt(monthId),
          dayId: day.id,
          status: false, // Default ke false
        },
      });
    }

    return newHabit;
  }

  //   update habits
  async updateHabit(id: string, habitData: UpdateHabitDto) {
    const exists = await this.prisma.habit.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!exists) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }
    return this.prisma.habit.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: habitData.title,
        maxDays: habitData.maxDays,
      },
    });
  }

  async getHabitsForMonth(monthId: number) {
    return this.prisma.habitStatus.findMany({
      where: {
        monthId,
      },
      include: {
        habit: true,
      },
    });
  }
  // habit status
  async updateHabitStatus(updateHabitStatusDto: UpdateHabitStatusDto) {
    const { dayId, habitId, status, userId } = updateHabitStatusDto;
    // Cek apakah habit status sudah ada
    const existingHabitStatus = await this.prisma.habitStatus.findFirst({
      where: {
        dayId: dayId,
        habitId: habitId,
        userId: {
          equals: userId || null,
        },
      },
    });
    if (!existingHabitStatus) {
      return { message: 'Habit status not found for the specified user.' };
    }

    await this.prisma.habitStatus.updateMany({
      where: {
        dayId: dayId,
        habitId: habitId,
        userId: {
          equals: userId || null,
        },
      },
      data: {
        status: status,
      },
    });

    const statusUpdated = await this.prisma.habitStatus.findFirst({
      where: {
        dayId: dayId,
        habitId: habitId,
        userId: {
          equals: userId || null,
        },
      },
    });

    return { message: 'Status updated successfully', statusUpdated };
  }

  async deleteHabit(id: string) {
    const exists = await this.prisma.habit.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!exists) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }
    return this.prisma.habit.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
}
