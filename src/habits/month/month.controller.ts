import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MonthService } from './month.service';
import { CreateMonthDto, UpdateMonthDto } from '../dto/month.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/auth.types';

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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.KESANTRIAN)
  @Post('/create')
  async createMonth(@Body() createMonthDto: CreateMonthDto) {
    return this.monthService.createMonth(createMonthDto); // Menambahkan bulan baru
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.KESANTRIAN)
  // delete month by id
  @Delete('/delete/:id')
  async deleteMonthById(@Param('id') id: string) {
    return this.monthService.deleteMonth(id);
  }

  @UseGuards(JwtAuthGuard)
  // get month by habit
  @Get(':monthId/monthWithHabitStatuses/:userId')
  async getMonthWithHabitStatuses(
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    return this.monthService.getMonthWithHabitStatuses(monthId, userId); // Mengambil status habits untuk bulan tertentu
  }

  @UseGuards(JwtAuthGuard)
  //get month by tilawah
  @Get(':monthId/monthWithTilawah/:userId')
  async getMonthWithTilawah(
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    return this.monthService.getMonthByTilawah(monthId, userId);
  }

  @UseGuards(JwtAuthGuard)
  //get month by murajaah
  @Get(':monthId/monthWithMurajaah/:userId')
  async getMonthWithMurajaah(
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    return this.monthService.getMonthByMurajaah(monthId, userId);
  }

  @UseGuards(JwtAuthGuard)
  //get month by ZIYADAH
  @Get(':monthId/monthWithZiyadah/:userId')
  async getMonthWithZiyadah(
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    return this.monthService.getMonthByZiyadah(monthId, userId);
  }
}
