import { Controller, Post, Body, Get, Put, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { HabitService } from './habit.service';
import {
  CreateHabitDto,
  UpdateHabitDto,
  UpdateHabitStatusDto,
} from '../dto/habit.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/auth.types';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { userPayload } from 'src/types/userPayload';

@Controller('habit')
export class HabitController {
  constructor(private habitService: HabitService) {}

  @Get('get')
  async getAllHabits() {
    return this.habitService.getAllHabits();
  }

  // post by admin
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Post('postByAdmin')
  async createHabit(@Body() createHabitDto: CreateHabitDto) {
    return this.habitService.createhabit(createHabitDto); // Sesuaikan nama method
  }
  // post by user
  @UseGuards(JwtAuthGuard)
  @Post('post/:monthId/habit/:userId')
  async createHabitByUser(
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitService.createHabitByUser(monthId, userId, createHabitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async UpdateHabit(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @getUser() user: userPayload,
  ) {
    return this.habitService.updateHabit(id, updateHabitDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:id')
  async getHabitsForMonth(@Param('id') id: number) {
    return this.habitService.getHabitsForMonth(id);
  }

  @UseGuards(JwtAuthGuard)
  // habit status
  @Patch('update')
  async updateHabitStatus(@Body() updateHabitStatusDto: UpdateHabitStatusDto, @getUser() user: userPayload) {
    return this.habitService.updateHabitStatus(updateHabitStatusDto,user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteHabit(@Param('id') id: string) {
    return this.habitService.deleteHabit(id);
  }
}
