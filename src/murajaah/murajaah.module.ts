import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { MurajaahController } from './murajaah.controller';
import { MurajaahServices } from './murajaah.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [MurajaahController],
  providers: [MurajaahServices],
  exports: [MurajaahServices],
})
export class MurajaahModule {}
