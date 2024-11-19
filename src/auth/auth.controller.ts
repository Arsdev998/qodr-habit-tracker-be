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
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, access_token } = await this.authService.login(loginDto);
    response.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
    return { user: user, token: access_token };
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
