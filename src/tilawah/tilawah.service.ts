import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { TilawahDto } from './tilawahdto';

@Injectable()
export class TilawahService {
  constructor(private prisma: PrismaService) {}

  async createTilawahInMoth(data: TilawahDto, monthId: string, userId: string) {
    const createTilawah = await this.prisma.tilawah.create({
      data: {
        surah: data.surah,
        lembar: data.lembar,
        userId: parseInt(userId),
        monthId: parseInt(monthId),
      },
    });

    return { message: 'Create Tilawah Success', createTilawah };
  }
  //   edit tilawah
  async editTilawahInMonth(data: TilawahDto, tilawahId: string) {
    const tilawah = await this.prisma.tilawah.findFirst({
      where: {
        id: parseInt(tilawahId),
      },
    });
    if (!tilawah) {
      throw new NotFoundException('Tilawah Notfound');
    }
    const tilawahEdit = await this.prisma.tilawah.update({
      where: {
        id: parseInt(tilawahId),
      },
      data: {
        lembar: data.lembar,
        surah: data.surah,
      },
    });
    return { message: 'Success Update Tilawah', tilawahEdit };
  }

  //   delete tilawah

  async deleteTilawahInMonth(tilawahId: string) {
    const tilawah = await this.prisma.tilawah.findFirst({
      where: {
        id: parseInt(tilawahId),
      },
    });
    if (!tilawah) {
      throw new NotFoundException('Tilawah NotFound');
    }
    const deleteTilawah = await this.prisma.tilawah.delete({
      where: {
        id: parseInt(tilawahId),
      },
    });
    return { message: 'Tilawah Deleted', deleteTilawah };
  }
}
