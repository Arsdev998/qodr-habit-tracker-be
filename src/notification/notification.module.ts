import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { SocketService } from '../socket/socket.service';
import { AuthModule } from 'src/auth/auth.module';
import { SocketGateWay } from 'src/socket/socket.gateway';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService, SocketGateWay, SocketService],
  exports: [NotificationService, SocketService, SocketGateWay],
})
export class NotificationModule {}
