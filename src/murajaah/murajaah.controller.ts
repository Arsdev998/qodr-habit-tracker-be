import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { MurajaahServices } from "./murajaah.service";
import { MurajaahDto } from "./murajaah.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";


@Controller('murajaah')
export class MurajaahController {
  constructor(private murajaahService: MurajaahServices) {}
  // post tilawah
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
  // update tilawah
  @UseGuards(JwtAuthGuard)
  @Patch('/update/:murajaahId')
  async editMurajaahUser(
    @Body() murajaaheditdata: MurajaahDto,
    @Param('murajaahId') murajaahId: string,
  ) {
    return this.murajaahService.editMurajaahInMonth(
      murajaaheditdata,
      murajaahId,
    );
  }
  @UseGuards(JwtAuthGuard)
  //   deleted tilawah
  @Delete('/delete/:murajaahId')
  async deleteMurajaahUser(@Param('murajaahId') murajaahId: string) {
    return this.murajaahService.deleteTilawahInMonth(murajaahId);
  }
}