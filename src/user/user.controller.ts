import { Controller,Get,Post,Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { Role } from "@prisma/client";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('get')
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
     
    @Post('create')
    async crateUser(@Body() data:{username:string; password:string, joinDate: string ,role: Role}) {
        return this.userService.createUser(data);
    }
}