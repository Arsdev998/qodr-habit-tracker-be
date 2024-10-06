import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { MonthController } from './month.controller';
import { MonthService } from './month.service';

@Module({
  imports: [PrismaModule],
  controllers: [MonthController],
  providers: [MonthService],
})
export class MonthModule {}
