import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma_config/prisma.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PrismaModule,
    // UserModule, // Import user module untuk user management
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Pastikan mengganti dengan secret yang aman
      signOptions: { expiresIn: '60m' }, // Token kedaluwarsa dalam 60 menit
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
  exports: [AuthService, JwtAuthGuard,JwtModule],
})
export class AuthModule {}
