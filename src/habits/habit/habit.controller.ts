import { Controller, Post, Body, Get, Put, Param, Patch } from '@nestjs/common';
import { HabitService } from './habit.service';
import {
  CreateHabitDto,
  UpdateHabitDto,
  UpdateHabitStatusDto,
} from '../dto/habit.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('habit')
export class HabitController {
  constructor(private habitService: HabitService) {}

  @Get('get')
  async getAllHabits() {
    return this.habitService.getAllHabits();
  }

  // post
  @Post('post')
  async createHabit(@Body() createHabitDto: CreateHabitDto) {
    return this.habitService.createhabit(createHabitDto); // Sesuaikan nama method
  }

  @Put('update/:id')
  async UpdateHabit(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitService.updateHabit(id, updateHabitDto);
  }

  @Get('month/:id')
  async getHabitsForMonth(@Param('id') id: number) {
    return this.habitService.getHabitsForMonth(id);
  }

  // habit status
  @Patch('update')
  async updateHabitStatus(
    @Body() updateHabitStatusDto: UpdateHabitStatusDto,
    @CurrentUser() user: any,
  ) {
    const userId = user.userId;
    return this.habitService.updateHabitStatus(userId, updateHabitStatusDto);
  }
}
