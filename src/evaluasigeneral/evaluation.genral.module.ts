import { Module } from '@nestjs/common';
import { EvaluationGeneralController } from './evaluation.general.controller';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { EvaluationGeneralService } from './evaluation.general.service';
import { AuthModule } from 'src/auth/auth.module';
import { SocketService } from 'src/socket/socket.service';
import { SocketGateWay } from 'src/socket/socket.gateway';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EvaluationGeneralController],
  exports: [EvaluationGeneralService, SocketGateWay, SocketService],
  providers: [EvaluationGeneralService, SocketGateWay, SocketService],
})
export class EvaluationGeneralModule {}
