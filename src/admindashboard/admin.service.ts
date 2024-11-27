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

    const habitStatusUpdateCount = await this.prisma.habitStatus.count({
      where: {
        updateAt: {
          gte: yesterday,
          lte: new Date(),
        },
      },
    });

    const evaluasiTodayCount = await this.prisma.evaluation.count({
      where: {
        createdAt: {
          gte: yesterday,
          lte: new Date(),
        },
      },
    });
    const murajaahCount = await this.prisma.murajaah.count({
      where: {
        createdAt: {
          gte: yesterday, // Greater than or equal to start of today
          lt: new Date(), // Less than current time
        },
      },
    });

    const ziyadahCount = await this.prisma.ziyadah.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: new Date(),
        },
      },
    });

    const tilawahCount = await this.prisma.tilawah.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: new Date(),
        },
      },
    });
    return {
      userCount: usercount,
      habitCount: habitCount,
      monthCount: monthCount,
      evaluationCount: evaluasiTodayCount,
      habitStatusCount: habitStatusUpdateCount,
      murajaahCount: murajaahCount,
      ziyadahCount: ziyadahCount,
      tilawahCount: tilawahCount,
    };
  }

//   GET HABIT STATUS TRAFIC
  async getTraficHabitStatusMonthData() {
    const habitStatusData = await this.prisma.habitStatus.groupBy({
      by: ['createdAt', 'status'],
      _count: {
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    if (habitStatusData.length === 0) {
      return [];
    }

    const totalData = {
      date: habitStatusData[0].createdAt.toISOString().split('T')[0],
      completed: habitStatusData
        .filter((item) => item.status === true)
        .reduce((sum, item) => sum + item._count.status, 0),
      pending: habitStatusData
        .filter((item) => item.status === false)
        .reduce((sum, item) => sum + item._count.status, 0),
    };

    return this.splitDataIntoWeeks([totalData]);
  }

  private splitDataIntoWeeks(data: any[]) {
    const weeklyData = [];

    const baseDate = new Date(data[0].date);
    const totalCompleted = data[0].completed;
    const totalPending = data[0].pending;

    const completedPerWeek = Math.floor(totalCompleted / 4);
    const pendingPerWeek = Math.floor(totalPending / 4);

    for (let i = 0; i < 4; i++) {
      const weekDate = new Date(baseDate);
      weekDate.setDate(baseDate.getDate() + i * 7);

      weeklyData.push({
        date: weekDate.toISOString().split('T')[0],
        completed: completedPerWeek,
        pending: pendingPerWeek,
      });
    }

    weeklyData[3].completed += totalCompleted % 4;
    weeklyData[3].pending += totalPending % 4;

    return weeklyData;
  }
}
