import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service'; // Pastikan import yang benar

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['jwt']; // Atau dari header jika Anda menggunakannya
    if (!token) {
      return next(); // Jika tidak ada token, lanjutkan tanpa menambahkan user
    }

    try {
      const user = await this.authService.validateToken(token); // Implementasikan metode untuk memvalidasi token dan mendapatkan user
      req.user = user; // Tambahkan user ke request
    } catch (error) {
      console.error('Token validation failed:', error);
    }

    next(); // Lanjutkan ke middleware/route berikutnya
  }
}
