import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitModule } from './habit/habit.module';
import { PrismaModule } from './prisma_config/prisma.module';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule,AuthModule,UserModule,HabitModule,SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
