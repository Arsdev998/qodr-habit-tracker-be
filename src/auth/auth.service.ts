import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(name);
    if (!user) {
      console.log('User not found');
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return null;
    }
    console.log('User and password are valid:', user);
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.name, loginDto.password);
    const payload = { name: user.name, sub: user.id, role: user.role };
    console.log(process.env.JWT_SECRET);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}