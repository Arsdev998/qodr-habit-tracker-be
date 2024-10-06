import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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