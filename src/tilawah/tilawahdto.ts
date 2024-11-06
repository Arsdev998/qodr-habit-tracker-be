import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class TilawahDto{
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    surah:string

    @IsNotEmpty()
    @IsNumber()
    lembar:number
}