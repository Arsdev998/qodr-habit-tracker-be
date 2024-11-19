import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    UserService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
