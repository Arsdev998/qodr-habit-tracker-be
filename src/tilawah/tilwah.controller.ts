import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TilawahDto } from './tilawahdto';
import { TilawahService } from './tilawah.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tilawah')
export class TilawahController {
  constructor(private tilawahService: TilawahService) {}
  //
  // post tilawah
  @UseGuards(JwtAuthGuard)
  @Post('/post/:monthId/:userId')
  async postTilawahByUser(
    @Body() createTilawahData: TilawahDto,
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    return this.tilawahService.createTilawahInMoth(
      createTilawahData,
      monthId,
      userId,
    );
  }
  // update tilawah
  @UseGuards(JwtAuthGuard)
  @Patch('/update/:tilawahId')
  async editTilawahUser(
    @Body() editTilawahData: TilawahDto,
    @Param('tilawahId') tilawahId: string,
  ) {
    return this.tilawahService.editTilawahInMonth(editTilawahData, tilawahId);
  }
  @UseGuards(JwtAuthGuard)
  //   deleted tilawah
  @Delete('/delete/:tilawahId')
  async deleteTilawahUser(@Param('tilawahId') tilawahId: string) {
    return this.tilawahService.deleteTilawahInMonth(tilawahId);
  }
}
