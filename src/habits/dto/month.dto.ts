import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateMonthDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Nama bulan

  @IsNotEmpty()
  @IsInt()
  year: number; // Tahun
}

export class UpdateMonthDto {
  @IsOptional()
  @IsString()
  name?: string; // Nama bulan

  @IsOptional()
  @IsInt()
  year?: number; // Tahun
}
