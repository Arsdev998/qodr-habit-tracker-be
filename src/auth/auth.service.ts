import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string) {
    const user = await this.userService.getUserByUsername(name);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.name, loginDto.password);

    const payload = {
      name: user.name,
      sub: user.id,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.getUserByUsername(decoded.name);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Cek apakah token sudah expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new UnauthorizedException('Token has expired');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
