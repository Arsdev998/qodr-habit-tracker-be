import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt, IsOptional, ValidateNested, IsArray } from 'class-validator';

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

  @IsOptional()
  date?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Validasi setiap elemen array
  @Type(() => DayDto) // Mapping ke DTO yang sesuai
  days?: DayDto[]; // Array of day objects
}

class DayDto {
  @IsInt()
  date: number; // Tipe data Int sesuai dengan Prisma
}


export class UpdateDaysDto{
  id:number;
  date:number;
}
