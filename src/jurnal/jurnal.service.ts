import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { JurnalDto } from './jurnaldto';

@Injectable()
export class JurnalService {
  constructor(private prisma: PrismaService) {}

  async createJurnalInMoth(data: JurnalDto, monthId: string, userId: string) {
    const month = await this.prisma.month.findFirst({
      where: {
        id: parseInt(monthId),
      },
    });

    if (!month) {
      throw new NotFoundException('Month Not Found');
    }
    const createTilawah = await this.prisma.jurnal.create({
      data: {
        date: data.date,
        activity: data.activity,
        userId: parseInt(userId),
        monthId: parseInt(monthId),
      },
    });

    return { message: 'Create Jurnal Success', createTilawah };
  }
  //   edit jurnal
  async editJurnalInMonth(
    data: JurnalDto,
    jurnalId: string,
    reqUSerId: number,
  ) {
    const jurnal = await this.prisma.jurnal.findFirst({
      where: {
        id: parseInt(jurnalId),
      },
    });
    if (!jurnal) {
      throw new NotFoundException('Jurnal Notfound');
    }
    if (jurnal.userId !== reqUSerId) {
      throw new ForbiddenException('ForbidenAcces Update This Resource');
    }
    const tilawahEdit = await this.prisma.jurnal.update({
      where: {
        id: parseInt(jurnalId),
      },
      data: {
        activity: data.activity,
        date: data.date,
      },
    });
    return { message: 'Success Update Tilawah', tilawahEdit };
  }

  //   delete jurnal

  async deleteJurnalInMonth(jurnalId: string, userReqId: number) {
    const jurnal = await this.prisma.jurnal.findFirst({
      where: {
        id: parseInt(jurnalId),
      },
    });
    if (!jurnal) {
      throw new NotFoundException('Tilawah NotFound');
    }
    const deleteJurnal = await this.prisma.jurnal.delete({
      where: {
        id: parseInt(jurnalId),
      },
    });
    return { message: 'Jurnal Deleted', deleteJurnal };
  }
}
