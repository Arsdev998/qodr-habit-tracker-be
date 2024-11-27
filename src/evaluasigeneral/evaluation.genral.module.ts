import { Module } from '@nestjs/common';
import { EvaluationGeneralController } from './evaluation.general.controller';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { EvaluationGeneralService } from './evaluation.general.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EvaluationGeneralController],
  exports: [EvaluationGeneralService],
  providers: [EvaluationGeneralService],
})
export class EvaluationGeneralModule {}
