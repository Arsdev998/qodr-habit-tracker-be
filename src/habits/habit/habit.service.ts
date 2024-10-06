import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { CreateHabitDto, UpdateHabitDto } from '../dto/habit.dto';

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

  //   update habits
  async updateHabit(id: string, habitData: UpdateHabitDto) {
    const habitId = parseInt(id);
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
}
