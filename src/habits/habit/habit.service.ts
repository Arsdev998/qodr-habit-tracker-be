import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { CreateHabitDto, UpdateHabitDto, UpdateHabitStatusDto } from '../dto/habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  //get all habits
  async getAllHabits() {
    return this.prisma.habit.findMany();
  }
  //   create habits
  async createhabit(habitData: CreateHabitDto) {
    return this.prisma.habit.create({
      data: habitData,
    });
  }

  async createHabitByUser(
    monthId: string,
    userId: string,
    habitData: CreateHabitDto,
  ) {
    const newHabit = await this.prisma.habit.create({
      data: {
        title: habitData.title,
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

    const update = await this.prisma.habitStatus.updateMany({
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

    return { message: 'Status updated', update };
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
