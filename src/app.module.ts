import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitModule } from './habit/habit.module';
import { PrismaModule } from './prisma/prisma.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [HabitModule,PrismaModule,SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
