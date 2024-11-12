import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ZiyadahServices} from './ziyadah.service';
import { ZiyadahDto } from './ziyadah.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('ziyadah')
export class ZiyadahController {
  constructor(private ziyadahServices: ZiyadahServices) {}
  // post tilawah

  @UseGuards(JwtAuthGuard)
  @Post('/post/:monthId/:userId')
  async postMurajaahByUser(
    @Body() createZiyadahData: ZiyadahDto,
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    return this.ziyadahServices.createZiyadahInMoth(
      createZiyadahData,
      monthId,
      userId,
    );
  }
  @UseGuards(JwtAuthGuard)
  // update tilawah
  @Patch('/update/:tilawahId')
  async editMurajaahUser(
    @Body() murajaaheditdata: ZiyadahDto,
    @Param('tilawahId') tilawahId: string,
  ) {
    return this.ziyadahServices.editMurajaahInMonth(
      murajaaheditdata,
      tilawahId,
    );
  }
  @UseGuards(JwtAuthGuard)
  //   deleted tilawah
  @Delete('/delete/:tilawahId')
  async deleteMurajaahUser(@Param('tilawahId') tilawahId: string) {
    return this.ziyadahServices.deleteTilawahInMonth(tilawahId);
  }
}
