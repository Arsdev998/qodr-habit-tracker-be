import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { access } from "fs";


@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService:JwtService
    ) {}

    async validateUser(username:string, password: string):Promise<any>{
        const user = await this.userService.getUserByUsername(username);
        if(user && (await bcrypt.compare(password, user.password))){
            const {password, ...result} = user;
            return result
        }
        return null
    }

    async login(user:any){
        const payload = {username: user.name, sub:user.id, role:user.role};
        return{
            access_token: this.jwtService.sign(payload)
        }
    }
}