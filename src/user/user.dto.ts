import { IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/auth/auth.types";

export class createUSerDto {
    @IsNotEmpty()
    @IsString()
    name:string
    
    @IsNotEmpty()
    @IsString()
    password:string

    @IsNotEmpty()
    @IsString()
    fullname:string
    
    @IsNotEmpty()
    @IsString()
    email:string


    @IsNotEmpty()
    @IsString()
    joinDate:string

    @IsString()
    @IsNotEmpty()
    role:Role
}
