import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma_config/prisma.service";

@Injectable() 
export class HabitService {
    constructor(private prisma: PrismaService) {}

    async createhabit(data: { title: string }) {
        return this.prisma.habit.create({
            data: {
                title: data.title,
            },
        });
    }

    async getHabits() {
        return this.prisma.habit.findMany();
    }
}
