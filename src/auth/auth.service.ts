import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";
import { User } from "@prisma/client";


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token); // Verifikasi token
      const user = await this.userService.getUserById(decoded.sub); // Mendapatkan user berdasarkan id dari payload token
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user; // Mengembalikan user jika valid
    } catch (error) {
      throw new UnauthorizedException('Invalid token'); // Mengembalikan UnauthorizedException jika token tidak valid
    }
  }

  async validateUser(name: string, password: string): Promise<any> {
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
    const payload = { name: user.name, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }
}