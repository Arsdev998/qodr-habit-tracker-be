import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'; // Local guard untuk strategi login
import { JwtAuthGuard } from './jwt.auth.guard'; // JWT guard untuk melindungi route
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('Login route accessed'); // Log apakah route ini terpanggil
    const { access_token } = await this.authService.login(loginDto);
    response.cookie('jwt', access_token, {
      httpOnly: process.env.PRODUCTION === 'production',
      secure: true,
      expires: new Date(Date.now() + 3600000),
    });
    return { message: 'Login successfully' };
  }

  // profile
  @UseGuards(JwtAuthGuard) // Gunakan JWT guard untuk melindungi route
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
