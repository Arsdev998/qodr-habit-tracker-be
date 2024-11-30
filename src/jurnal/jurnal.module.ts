import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { JurnalService } from './jurnal.service';
import { AuthModule } from 'src/auth/auth.module';
import { JurnalController } from './jurnal.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [JurnalController],
  providers: [JurnalService],
  exports: [JurnalService],
})
export class JurnalModule {}
