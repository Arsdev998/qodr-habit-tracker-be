import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
    console.log('LocalStrategy initialized'); // Log apakah strategy diinisialisasi
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('Validating user:', username); // Log input username
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      console.log('Validation failed: Unauthorized');
      throw new UnauthorizedException('Invalid Username or Password');
    }
    console.log('Validation successful:', user);
    return user;
  }
}


