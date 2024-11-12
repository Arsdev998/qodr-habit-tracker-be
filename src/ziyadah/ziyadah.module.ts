import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { ZiyadahController } from './ziyadah.controller';
import { ZiyadahServices } from './ziyadah.service';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [ZiyadahController],
  providers: [ZiyadahServices],
  exports: [ZiyadahServices],
})
export class ZiyadahModule {}
