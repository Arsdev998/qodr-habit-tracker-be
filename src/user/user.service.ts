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

  async getUserById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
//    CREATE USER FUNCTION
  async createUser(data: createUSerDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const checkUser = await this.prisma.user.findFirst({
      where: {
        name: data.name,
      },
    });
    if (checkUser) {
      throw new Error('User already exists');
    }
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        password: hashedPassword,
        fullname:data.fullname,
        email:data.email,
        joinDate: data.joinDate,
        motivation: '',
        role:data.role
      },
    });

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
