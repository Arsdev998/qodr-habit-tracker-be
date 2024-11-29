import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';

@Injectable()
export class AdminServices {
  constructor(private readonly prisma: PrismaService) {}

  async getDataInDashboard() {
    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);

    const usercount = await this.prisma.user.count({
      where: {
        role: 'SANTRI',
      },
    });
    const habitCount = await this.prisma.habit.count({
      where: {
        userId: null,
      },
    });
    const monthCount = await this.prisma.month.count();

    const evaluasiTodayCount = await this.prisma.evaluation.count({
      where: {
        createdAt: {
          gte: yesterday,
          lte: new Date(),
        },
      },
    });
    return {
      userCount: usercount,
      habitCount: habitCount,
      monthCount: monthCount,
      evaluationCount: evaluasiTodayCount,
    };
  }

  async getTraficHabitStatusMonthData() {
    // Get the start of the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const habitStatusData = await this.prisma.habitStatus.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Group data by week
    const weeklyAggregation = this.aggregateByWeeks(habitStatusData);

    return weeklyAggregation;
  }

  private aggregateByWeeks(data: Array<{ createdAt: Date; status: boolean }>) {
    // Create 4 weeks from the start of the month
    const weeks = [
      {
        start: this.getWeekStart(0),
        end: this.getWeekStart(1),
        completed: 0,
        pending: 0,
      },
      {
        start: this.getWeekStart(1),
        end: this.getWeekStart(2),
        completed: 0,
        pending: 0,
      },
      {
        start: this.getWeekStart(2),
        end: this.getWeekStart(3),
        completed: 0,
        pending: 0,
      },
      {
        start: this.getWeekStart(3),
        end: this.getWeekStart(4),
        completed: 0,
        pending: 0,
      },
    ];

    // Aggregate data into weeks
    data.forEach((entry) => {
      const weekIndex = weeks.findIndex(
        (week) => entry.createdAt >= week.start && entry.createdAt < week.end,
      );

      if (weekIndex !== -1) {
        entry.status
          ? weeks[weekIndex].completed++
          : weeks[weekIndex].pending++;
      }
    });

    // Transform to required format
    return weeks.map((week, index) => ({
      date: week.start.toISOString().split('T')[0],
      completed: week.completed,
      pending: week.pending,
    }));
  }

  private getWeekStart(weekOffset: number): Date {
    const date = new Date();
    date.setDate(1 + weekOffset * 7);
    return date;
  }
}
