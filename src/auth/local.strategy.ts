import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    });
    console.log("LocalStrategy initialized");
  }

  async validate(name: string, password: string): Promise<any> {
    console.log('Validating user in LocalStrategy:', name); // Log input username
    const user = await this.authService.validateUser(name, password);
    if (!user) {
      console.log('Validation failed: Unauthorized');
      throw new UnauthorizedException('Invalid Username or Password');
    }
    console.log('Validation successful in LocalStrategy:', user);
    return user;
  }
}



