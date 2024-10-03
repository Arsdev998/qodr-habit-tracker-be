import { Controller,Get,Post,Body, Param } from "@nestjs/common";
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
 
    @Get('get/:username')
    async getUserByUsername(@Param('username') username: string) {
        return this.userService.getUserByUsername(username);
    }

    @Get('getById/:id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }
}