import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'; // Local guard untuk strategi login
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // JWT guard untuk melindungi route
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // login
  // @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { user, access_token, expiresIn } =
        await this.authService.login(loginDto);

      // Set cookie dengan options yang lebih spesifik
      response.cookie('jwt', access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: expiresIn * 1000, // Convert to milliseconds
        path: '/',
        domain: process.env.COOKIE_DOMAIN || undefined, // Opsional: set domain jika diperlukan
      });

      // Log untuk debugging
      console.log('Cookie set with options:', {
        token: access_token.substring(0, 20) + '...', // Log partial token
        expiresIn,
        maxAge: expiresIn * 1000,
      });

      return {
        user,
        token: access_token,
        expiresIn,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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

  //status
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async checkAuth(@Req() req) {
    const user = await this.userService.getUserById(req.user.sub);
    return { message: 'Authenticated', user: user };
  }
}
