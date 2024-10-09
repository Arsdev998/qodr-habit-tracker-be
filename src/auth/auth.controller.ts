import {
  Controller,
  Post,
  Body,
  // Request,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'; // Local guard untuk strategi login
import { JwtAuthGuard } from './guards/jwt.auth.guard'; // JWT guard untuk melindungi route
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
    const { user ,access_token } = await this.authService.login(loginDto);
    response.cookie('jwt', access_token, {
      httpOnly: process.env.PRODUCTION === 'production',
      secure: process.env.PRODUCTION === 'production',
      expires: new Date(Date.now() + 3600000),
    });

    return user;
  }

  // logout
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('jwt', '', {
      httpOnly: process.env.PRODUCTION === 'production',
      expires: new Date(0),
      secure: true,
    });
    return { message: 'Logout successfully' };
  }
}
