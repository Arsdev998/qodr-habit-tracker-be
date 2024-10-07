import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateMonthDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Nama bulan

  @IsNotEmpty()
  @IsInt()
  year: number; // Tahun

  @IsNotEmpty()
  @IsOptional()
  days: number; // Daftar hari dalam bulan
}

export class UpdateMonthDto {
  @IsOptional()
  @IsString()
  name?: string; // Nama bulan

  @IsOptional()
  @IsInt()
  year?: number; // Tahun
}
