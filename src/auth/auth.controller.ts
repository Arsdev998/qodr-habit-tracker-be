import { Controller, Post, Body, Request, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'; // Local guard untuk strategi login
import { JwtAuthGuard } from './jwt.auth.guard'; // JWT guard untuk melindungi route
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

//   @UseGuards(LocalAuthGuard) // Gunakan guard untuk login
  @Post('login')
  async login(
    @Body() loginDto:LoginDto,
    @Res({passthrough:true}) response:Response
  ) {
    const {access_token} = await this.authService.login(loginDto);
    response.cookie('jwt',access_token, {httpOnly:true, secure:true});
    return {message: 'Login succesfully'}
  }

  @UseGuards(JwtAuthGuard) // Gunakan JWT guard untuk melindungi route
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
