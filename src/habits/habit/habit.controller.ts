import { Controller, Post, Body, Get, Put, Param, Patch, Delete } from '@nestjs/common';
import { HabitService } from './habit.service';
import {
  CreateHabitDto,
  UpdateHabitDto,
  UpdateHabitStatusDto,
} from '../dto/habit.dto';

@Controller('habit')
export class HabitController {
  constructor(private habitService: HabitService) {}

  @Get('get')
  async getAllHabits() {
    return this.habitService.getAllHabits();
  }

  // post by admin
  @Post('post')
  async createHabit(@Body() createHabitDto: CreateHabitDto) {
    return this.habitService.createhabit(createHabitDto); // Sesuaikan nama method
  }

  // post by user
  @Post('post/:monthId/habit/:userId')
  async createHabitByUser(
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitService.createHabitByUser(monthId,userId, createHabitDto);
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
  ) {
    const userId = 1;
    return this.habitService.updateHabitStatus(updateHabitStatusDto);
  }
  
  @Delete('delete/:id')
  async deleteHabit(@Param('id') id: string) {
    return this.habitService.deleteHabit(id);
  }
}
