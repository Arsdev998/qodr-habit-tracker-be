import { SetMetadata } from '@nestjs/common';
import { Role } from '../auth.types'; // Sesuaikan path-nya

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
