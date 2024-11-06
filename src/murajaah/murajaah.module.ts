import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { MurajaahController } from './murajaah.controller';
import { MurajaahServices } from './murajaah.service';

@Module({
  imports: [PrismaModule],
  controllers: [MurajaahController],
  providers: [MurajaahServices],
  exports: [MurajaahServices],
})
export class MurajaahModule {}
