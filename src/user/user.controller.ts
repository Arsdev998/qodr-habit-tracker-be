import { Controller,Get,Post,Body, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Role } from "../auth/auth.types";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/guards/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { createUSerDto } from "./user.dto";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @UseGuards(JwtAuthGuard)
    @Roles(Role.SANTRI,Role.ADMIN)
    @Get('getAll')
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
     
    @Post('create')
    async crateUser(@Body() data:createUSerDto) {
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