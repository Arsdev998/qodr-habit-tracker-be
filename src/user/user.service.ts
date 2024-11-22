import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import * as bcrypt from 'bcrypt';
import { createUSerDto, UpdatePasswordDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByUsername(name: string) {
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

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        id: true,
        name: true,
        fullname: true,
        email: true,
        joinDate: true,
        motivation: true,
        role: true,
        createdAt: true,
        updateAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //
  async createUser(data: createUSerDto) {
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

    // Gunakan prisma transaction untuk memastikan atomicity
    return await this.prisma.$transaction(async (tx) => {
      // Buat user baru
      const user = await tx.user.create({
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

      // Ambil semua data yang diperlukan dalam satu query
      const [months, habits] = await Promise.all([
        tx.month.findMany({
          include: {
            days: true,
          },
        }),
        tx.habit.findMany({
          where: {
            userId: null,
          },
        }),
      ]);
      const habitStatusData = [];
      // Buat array data untuk bulk insert
      for (const month of months) {
        for (const habit of habits) {
          for (const day of month.days) {
            habitStatusData.push({
              userId: user.id,
              habitId: habit.id,
              monthId: month.id,
              dayId: day.id,
              status: false,
            });
          }
        }
      }
      // Lakukan bulk insert untuk semua habitStatus sekaligus
      if (habitStatusData.length > 0) {
        await tx.habitStatus.createMany({
          data: habitStatusData,
        });
      }

      return user;
    });
  }

  async getAllUsers(skip: number = 0, take: number = 10) {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        fullname: true,
        email: true,
        motivation: true,
        joinDate: true,
        role: true,
        createdAt: true,
        updateAt: true,
      },
      orderBy: {
        name: 'asc',
      },
      skip: skip,
      take: take,
    });

    if (!users) {
      throw new Error('Users not found');
    }
    return users;
  }

  async editUser(userId: string, data: createUSerDto) {
    const { name, fullname, email, motivation } = data;
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const updated = await this.prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        name: name,
        fullname: fullname,
        email: email,
        motivation: motivation,
      },
    });
    return { message: 'User Updated Successfully', updated };
  }

  async deletedUser(userId: string) {
    const user = this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const deleted = await this.prisma.user.delete({
      where: {
        id: parseInt(userId),
      },
    });

    return { message: 'User Deleted Success' };
  }

  async updatePassword(userId: string, data: UpdatePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = data;
    const user = await this.prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    if (!user.password || !oldPassword || !newPassword || !confirmPassword) {
      throw new NotFoundException('Password Not Found');
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Password Not Match');
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await this.prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        password: hashedPassword,
      },
    });
    return { message: 'Password Updated Successfully' };
  }
}
