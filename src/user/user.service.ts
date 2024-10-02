import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma_config/prisma.service";
import { Role, User } from "@prisma/client";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUserByUsername(userId: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                name: userId
            }
        })
    }

    async createUser(data: {username:string; password:string, joinDate: string ,role: Role}): Promise<User>{
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data:{
                name: data.username,
                password: hashedPassword,
                role: data.role,
                joinDate: data.joinDate,
                motivation: " ",
            }
        })
    }

 async getAllUsers(skip: number = 0, take: number = 10): Promise<User[]> {
    return this.prisma.user.findMany({
        orderBy: {
            name: 'asc'
        },
        skip: skip,
        take: take
    });
}
}


