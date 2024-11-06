import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ZiyadahServices} from './ziyadah.service';
import { ZiyadahDto } from './ziyadah.dto';

@Controller('ziyadah')
export class ZiyadahController {
  constructor(private ziyadahServices: ZiyadahServices) {}
  // post tilawah
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
  //   deleted tilawah
  @Delete('/delete/:tilawahId')
  async deleteMurajaahUser(@Param('tilawahId') tilawahId: string) {
    return this.ziyadahServices.deleteTilawahInMonth(tilawahId);
  }
}
