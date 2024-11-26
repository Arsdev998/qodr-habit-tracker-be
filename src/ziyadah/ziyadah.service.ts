import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { ZiyadahDto } from './ziyadah.dto';

@Injectable()
export class ZiyadahServices {
  constructor(private prisma: PrismaService) {}
  //   post ziyadah
  async createZiyadahInMoth(data: ZiyadahDto, monthId: string, userId: string) {
    const createZiyadah = await this.prisma.ziyadah.create({
      data: {
        surah: data.surah,
        date: data.date,
        userId: parseInt(userId),
        monthId: parseInt(monthId),
      },
    });

    return { message: 'Create Ziyadah Success', createZiyadah };
  }
  //   edit ziyadah
  async editMurajaahInMonth(data: ZiyadahDto, ziyadahId: string, reqUSerId: number) {
    const ziyadah = await this.prisma.ziyadah.findFirst({
      where: {
        id: parseInt(ziyadahId),
      },
    });
    if (!ziyadah) {
      throw new NotFoundException('Ziyadah Notfound');
    }
    if (ziyadah.userId !== reqUSerId) {
      throw new ForbiddenException('ForbidenAcces Update This Resource');
    }
    const tilawahEdit = await this.prisma.ziyadah.update({
      where: {
        id: parseInt(ziyadahId),
      },
      data: {
        surah: data.surah,
        date: data.date,
      },
    });
    return { message: 'Success Update Ziyadah', tilawahEdit };
  }

  //   delete ziyadah

  async deleteTilawahInMonth(ziyadahId: string , reqUSerId: number) {
    const ziyadah = await this.prisma.ziyadah.findFirst({
      where: {
        id: parseInt(ziyadahId),
      },
    });
    if (!ziyadah) {
      throw new NotFoundException('Ziyadah NotFound');
    }
    if(reqUSerId.toString() !== ziyadah.userId.toString()) {
      throw new ForbiddenException('ForbidenAcces Deleted This Resource');
    }
    const deleteTilawah = await this.prisma.ziyadah.delete({
      where: {
        id: parseInt(ziyadahId),
      },
    });
    return { message: 'Ziyadah Deleted', deleteTilawah };
  }
}
