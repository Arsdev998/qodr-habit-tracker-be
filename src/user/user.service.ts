import { Injectable, NotFoundException, } from "@nestjs/common";
import { PrismaService } from "src/prisma_config/prisma.service";
import { Role, User } from "@prisma/client";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUserByUsername(name: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                name: name
            }
        })
        console.log("user result",user);
        if(!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async getUserById(userId: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        })

        if(!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async createUser(data: {username:string; password:string, joinDate: string ,role: Role}): Promise<User>{
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const checkUser = await this.prisma.user.findFirst({
            where: {
                name:data.username
            }
        });
        if(checkUser) {
             throw new Error('User already exists')
        }
        const user = await this.prisma.user.create({
            data:{
                name: data.username,
                password: hashedPassword,
                role: data.role,
                joinDate: data.joinDate,
                motivation: " ",
            }
        })

        return user
    }

    async getAllUsers(skip: number = 0, take: number = 10): Promise<User[]> {
    const user  = await  this.prisma.user.findMany({
        orderBy: {
            name: 'asc'
        },
        skip: skip,
        take: take
    });

    if(!user) {
        throw new Error('User not found')
    }
    return user
    }
}


