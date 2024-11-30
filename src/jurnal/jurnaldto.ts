import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class JurnalDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  day: string;

  @IsNotEmpty()
  @IsNumber()
  activity:string;


  @IsNotEmpty()
  @IsDate()
  date : Date
}