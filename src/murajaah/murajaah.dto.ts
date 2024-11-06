import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class MurajaahDto{
    @IsString()
    @IsNotEmpty()
    surah: string

    @IsDate()
    @IsNotEmpty()
    date: Date
}