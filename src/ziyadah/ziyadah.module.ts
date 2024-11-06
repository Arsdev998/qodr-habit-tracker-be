import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { ZiyadahController } from './ziyadah.controller';
import { ZiyadahServices } from './ziyadah.service';


@Module({
  imports: [PrismaModule],
  controllers: [ZiyadahController],
  providers: [ZiyadahServices],
  exports: [ZiyadahServices],
})
export class ZiyadahModule {}
