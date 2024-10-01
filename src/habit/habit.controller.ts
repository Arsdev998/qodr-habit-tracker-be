import { Controller, Post, Body,Get } from '@nestjs/common';
import { HabitService } from './habit.service';

@Controller('habit')
export class HabitController {
    constructor(private habitService: HabitService) {}

    @Post("post")
    async createHabit(@Body() data: { title: string }) {
        return this.habitService.createhabit(data); // Sesuaikan nama method
    }

    @Get("get")
    async getAllHabits() {
        return this.habitService.getHabits();
    }
}
