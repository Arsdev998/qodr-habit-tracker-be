import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MurajaahServices } from './murajaah.service';
import { MurajaahDto } from './murajaah.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getUser } from 'src/auth/decorators/get.user.decorator';
import { userPayload } from 'src/types/userPayload';

@Controller('murajaah')
export class MurajaahController {
  constructor(private murajaahService: MurajaahServices) {}
  // post murajaah
  @UseGuards(JwtAuthGuard)
  @Post('/post/:monthId/:userId')
  async postMurajaahByUser(
    @Body() createMurajaahData: MurajaahDto,
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    return this.murajaahService.createMurajaahInMoth(
      createMurajaahData,
      monthId,
      userId,
    );
  }
  // update murajaah
  @Patch('/update/:murajaahId')
  @UseGuards(JwtAuthGuard)
  async editMurajaahUser(
    @Body() murajaaheditdata: MurajaahDto,
    @Param('murajaahId') murajaahId: string,
    @getUser() user: userPayload,
  ) {
    return this.murajaahService.editMurajaahInMonth(
      murajaaheditdata,
      murajaahId,
      user.sub,
    );
  }

  //   deleted murajaah
  @Delete('/delete/:murajaahId')
  @UseGuards(JwtAuthGuard)
  async deleteMurajaahUser(
    @Param('murajaahId') murajaahId: string,
    @getUser() user: userPayload,
  ) {
    return this.murajaahService.deleteTilawahInMonth(murajaahId, user.sub);
  }
}
