import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getUser } from '../auth/decorators/get.user.decorator';
import { userPayload } from 'src/types/userPayload';
import { JurnalService } from './jurnal.service';
import { JurnalDto } from './jurnaldto';

@Controller('jurnal')
export class JurnalController {
  constructor(private jurnalService: JurnalService) {}
  //
  // post tilawah
  @UseGuards(JwtAuthGuard)
  @Post('/post/:monthId/:userId')
  async postTilawahByUser(
    @Body() jurnalData: JurnalDto,
    @Param('monthId') monthId: string,
    @Param('userId') userId: string,
  ) {
    console.log(jurnalData)
    return this.jurnalService.createJurnalInMoth(
      jurnalData,
      monthId,
      userId,
    );
  }
  // update tilawah
  @UseGuards(JwtAuthGuard)
  @Patch('/update/:jurnalId')
  async editTilawahUser(
    @Body() editTilawahData: JurnalDto,
    @Param('jurnalId') jurnalId: string,
    @getUser() user: userPayload,
  ) {
    return this.jurnalService.editJurnalInMonth(
      editTilawahData,
      jurnalId,
      user.sub,
    );
  }
  @UseGuards(JwtAuthGuard)
  //   deleted tilawah
  @Delete('/delete/:jurnalId')
  async deleteTilawahUser(
    @Param('jurnalId') jurnalId: string,
    @getUser() user: userPayload,
  ) {
    return this.jurnalService.deleteJurnalInMonth(jurnalId, user.sub);
  }
}
