import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { MonthController } from './month.controller';
import { MonthService } from './month.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [MonthController],
  providers: [MonthService],
})
export class MonthModule {}
