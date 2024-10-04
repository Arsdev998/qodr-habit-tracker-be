import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Role, User } from '../auth.types';
@Injectable()
export class RolesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; 
    if (!user) {
      throw new ForbiddenException('User not logged in');
    }

    const allowedRoles = [Role.SUPERADMIN, Role.ADMIN];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    next();
  }
}
