import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ZiyadahDto {
  @IsString()
  @IsNotEmpty()
  surah: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;
}
