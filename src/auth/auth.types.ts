export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  SANTRI = 'SANTRI',
}

export interface User {
  id: number;
  name: string;
  password: string;
  role: Role;
}
