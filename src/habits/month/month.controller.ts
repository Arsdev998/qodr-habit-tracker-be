import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { MonthService } from './month.service';
import { CreateMonthDto,UpdateMonthDto } from '../dto/month.dto';

@Controller('months')
export class MonthController {
  constructor(private readonly monthService: MonthService) {}

  @Get()
  async getAllMonths() {
    return this.monthService.getAllMonths(); // Mengambil semua bulan
  }

  @Post("create")
  async createMonth(@Body() createMonthDto: CreateMonthDto) {
    return this.monthService.createMonth(createMonthDto); // Menambahkan bulan baru
  }

  @Put(':id')
  async updateMonth(
    @Param('id') id: number,
    @Body() updateMonthDto: UpdateMonthDto,
  ) {
    return this.monthService.updateMonth(id, updateMonthDto); // Memperbarui bulan berdasarkan ID
  }

  @Get(':id/habits')
  async getHabitsForMonth(@Param('id') monthId: number) {
    return this.monthService.getHabitsForMonth(monthId); // Mengambil habit untuk bulan tertentu
  }
}
