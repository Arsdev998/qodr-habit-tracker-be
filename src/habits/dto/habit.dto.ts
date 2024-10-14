import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHabitDto {
  @IsNotEmpty()
  @IsString()
  title: string; // Nama habit yang akan dilakukan oleh user
}

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  title?: string; // Nama habit yang akan diupdate, bisa opsional
}

export class CreateHabitStatusDto {
  @IsNotEmpty()
  @IsInt()
  userId: number; // ID user yang mengisi

  @IsNotEmpty()
  @IsInt()
  habitId: number; // ID habit yang diisi statusnya

  @IsNotEmpty()
  @IsInt()
  monthId: number; // ID bulan

  @IsNotEmpty()
  @IsInt()
  dayId: number; // ID hari

  @IsNotEmpty()
  @IsBoolean()
  status: boolean; // True jika tercentang, False jika tidak

  @IsOptional()
  @IsString()
  comments?: string; // Alasan jika tidak tercentang (opsional)
}

export class UpdateHabitStatusDto {
  dayId: number;
  habitId: number;
  userId: number; // Pastikan ini ada
  status: boolean;
}