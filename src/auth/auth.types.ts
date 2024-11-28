export enum Role {
  KESANTRIAN = 'KESANTRIAN',
  PENGURUS = 'PENGURUS',
  SANTRI = 'SANTRI',
}

export interface User {
  id: number;
  name: string;
  password: string;
  role: Role;
}
