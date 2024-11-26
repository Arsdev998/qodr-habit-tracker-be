import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { MurajaahServices } from "./murajaah.service";
import { MurajaahDto } from "./murajaah.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserOwnershipGuard } from "src/auth/guards/user-ownership.guard";
import { getUser } from "src/auth/decorators/get-user.decorator";


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
  @UseGuards(JwtAuthGuard,UserOwnershipGuard)
  @Patch('/update/:murajaahId')
  async editMurajaahUser(
    @Body() murajaaheditdata: MurajaahDto,
    @Param('murajaahId') murajaahId: string,
    @getUser() user: any
  ) {
    console.log('user',user)
    return this.murajaahService.editMurajaahInMonth(
      murajaaheditdata,
      murajaahId
    );
  }
  @UseGuards(JwtAuthGuard)
  //   deleted murajaah
  @Delete('/delete/:murajaahId')
  async deleteMurajaahUser(@Param('murajaahId') murajaahId: string) {
    return this.murajaahService.deleteTilawahInMonth(murajaahId);
  }
}