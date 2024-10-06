import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Ambil token dari header

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; // Simpan payload di request
      return true; // Token valid
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
