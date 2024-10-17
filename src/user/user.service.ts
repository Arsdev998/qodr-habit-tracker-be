import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createUSerDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByUsername(name: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        name: name,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserById(userId: string){
    const user = await this.prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select:{
        id: true,
        name: true,
        fullname: true,
        email: true,
        joinDate: true,
        motivation: true,
        role: true,
        createdAt: true,
        updateAt: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async createUser(data: createUSerDto): Promise<User> {
    // Hash password user
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Cek apakah user sudah ada
    const checkUser = await this.prisma.user.findFirst({
      where: {
        name: data.name,
      },
    });

    if (checkUser) {
      throw new Error('User already exists');
    }

    // Buat user baru
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        password: hashedPassword,
        fullname: data.fullname,
        email: data.email,
        joinDate: data.joinDate,
        motivation: '',
        role: data.role,
      },
    });

    // Ambil semua bulan yang ada
    const months = await this.prisma.month.findMany({
      include: {
        days: true, // Ambil semua hari dalam setiap bulan
      },
    });

    // Ambil semua habit yang ada
    const habits = await this.prisma.habit.findMany({
      where:{
        userId: null
      }
    });
    // Loop untuk setiap bulan
    for (const month of months) {
      // Loop untuk setiap habit
      for (const habit of habits) {
        // Loop untuk setiap hari di bulan tersebut
        for (const day of month.days) {
          // Tambahkan habitStatus untuk user baru
          await this.prisma.habitStatus.create({
            data: {
              userId: user.id, // User yang baru dibuat
              habitId: habit.id,
              monthId: month.id,
              dayId: day.id, // ID hari yang sesuai
              status: false, // Default ke false
            },
          });
        }
      }
    }

    return user;
  }

  async getAllUsers(skip: number = 0, take: number = 10): Promise<User[]> {
    const user = await this.prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
      skip: skip,
      take: take,
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
