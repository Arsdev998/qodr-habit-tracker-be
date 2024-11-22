import { IsNotEmpty, IsString, Max } from "class-validator";
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
    motivation:string


    @IsNotEmpty()
    @IsString()
    joinDate:string

    @IsString()
    @IsNotEmpty()
    role:Role
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Max(15)
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  @Max(15)
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  @Max(15)
  confirmPassword: string;
}
