import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ZiyadahServices } from './ziyadah.service';
import { ZiyadahDto } from './ziyadah.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getUser } from '../auth/decorators/get.user.decorator';
import { userPayload } from 'src/types/userPayload';

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
  // update tilawah
  @UseGuards(JwtAuthGuard)
  @Patch('/update/:tilawahId')
  async editMurajaahUser(
    @Body() murajaaheditdata: ZiyadahDto,
    @Param('tilawahId') tilawahId: string,
    @getUser() user: userPayload,
  ) {
    return this.ziyadahServices.editMurajaahInMonth(
      murajaaheditdata,
      tilawahId,
      user.sub,
    );
  }
  @UseGuards(JwtAuthGuard)
  //   deleted tilawah
  @Delete('/delete/:tilawahId')
  async deleteMurajaahUser(
    @Param('tilawahId') tilawahId: string,
    @getUser() user: userPayload,
  ) {
    return this.ziyadahServices.deleteTilawahInMonth(tilawahId, user.sub);
  }
}
