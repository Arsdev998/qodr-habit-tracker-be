import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { MurajaahDto } from './murajaah.dto';

@Injectable()
export class MurajaahServices {
  constructor(private readonly prisma: PrismaService
  ) {}
  //   post murajaah
  async createMurajaahInMoth(
    data: MurajaahDto,
    monthId: string,
    userId: string,
  ) {
    const createMurajaah = await this.prisma.murajaah.create({
      data: {
        surah: data.surah,
        date: data.date,
        userId: parseInt(userId),
        monthId: parseInt(monthId),
      },
    });

    return { message: 'Create Murajaah Success', createMurajaah };
  }
  //   edit murajaah
  async editMurajaahInMonth(data: MurajaahDto, murajaahId: string, userReqId:number) {
    const murajaah = await this.prisma.murajaah.findFirst({
      where: {
        id: parseInt(murajaahId),
      },
    });
    if (!murajaah) {
      throw new NotFoundException('Murajaah Notfound');
    }
    if(userReqId.toString() !== murajaah.userId.toString()){
      throw new ForbiddenException('ForbidenAcces Update This Resource');
    }
    const tilawahEdit = await this.prisma.murajaah.update({
      where: {
        id: parseInt(murajaahId),
      },
      data: {
        surah: data.surah,
        date: data.date,
      },
    });
    return { message: 'Success Update Murajaah', tilawahEdit };
  }

  //   delete murajaah

  async deleteTilawahInMonth(murajaahId: string,userReqId:number) {
    const murajaah = await this.prisma.murajaah.findFirst({
      where: {
        id: parseInt(murajaahId),
      },
    });
    if (!murajaah) {
      throw new NotFoundException('Murajaah NotFound');
    }
     if (userReqId.toString() !== murajaah.userId.toString()) {
       throw new ForbiddenException('ForbidenAcces Update This Resource');
     }
    const deleteTilawah = await this.prisma.murajaah.delete({
      where: {
        id: parseInt(murajaahId),
      },
    });
    return { message: 'Murajaah Deleted', deleteTilawah };
  }
}
