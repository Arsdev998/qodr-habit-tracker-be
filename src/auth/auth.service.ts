import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";


@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UserService,
        private readonly jwtService:JwtService
    ) {}

  async validateUser(name: string, password: string): Promise<any> {
   const user = await this.userService.getUserByUsername(name.toLowerCase());
   console.log('User found:', user); // Log untuk melihat user yang ditemukan
   if (user && (await bcrypt.compare(password, user.password))) {
    console.log('Password match');
    const { password, ...result } = user;
    return result;
   }
   console.log('Password mismatch');
   return null;
 }




    async login(loginDto:LoginDto){
        const user = await this.userService.getUserByUsername(loginDto.name);
        if(!user){
            throw  new NotFoundException('User not found')
        }
        const payload = {name: user.name, sub:user.id, role:user.role};
        console.log(process.env.JWT_SECRET);
        
        return{
            access_token: this.jwtService.sign(payload)
        }
    }
}