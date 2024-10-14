import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MonthService } from './month.service';
import { CreateMonthDto, UpdateMonthDto } from '../dto/month.dto';

@Controller('months')
export class MonthController {
  constructor(private readonly monthService: MonthService) {}

  @Get()
  async getAllMonths() {
    return this.monthService.getAllMonths(); // Mengambil semua bulan
  }

  // gethabit by id
  @Get(':id')
  async getMonthById(@Param('id') id: string) {
    return this.monthService.getMonthById(id); // Mengambil bulan berdasarkan ID
  }

  @Post('/create')
  async createMonth(@Body() createMonthDto: CreateMonthDto) {
    return this.monthService.createMonth(createMonthDto); // Menambahkan bulan baru
  }

  @Put('/update/:id')
  async updateMonth(
    @Param('id') id: string,
    @Body() updateMonthDto: UpdateMonthDto,
  ) {
    return this.monthService.updateMonth(id, updateMonthDto); // Memperbarui bulan berdasarkan ID
  }

  // delete month by id
  @Delete('/delete/:id')
  async deleteMonthById(@Param('id') id: string) {
    return this.monthService.deleteMonth(id);
  }

  @Get(':id/habits')
  async getHabitsForMonth(@Param('id') monthId: number) {
    return this.monthService.getHabitsForMonth(monthId); // Mengambil habit untuk bulan tertentu
  }

  @Get(':monthId/monthWithHabitStatuses/:userId')
  async getMonthWithHabitStatuses(
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    return this.monthService.getMonthWithHabitStatuses(monthId, userId); // Mengambil status habits untuk bulan tertentu
  }
}
