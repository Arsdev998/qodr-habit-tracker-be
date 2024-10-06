import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitModule } from './habits/habit/habit.module';
import { PrismaModule } from './prisma_config/prisma.module';
import { SocketModule } from './socket/socket.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { MonthModule } from './habits/month/month.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Menjadikan ConfigModule dapat diakses di seluruh aplikasi
      envFilePath: '.env', // Menentukan lokasi file .env
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    HabitModule,
    MonthModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*'); // Sesuaikan dengan rute Anda
  }
}
