import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from '../auth/auth.types';
import { Roles } from 'src/auth/guards/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createUSerDto, UpdatePasswordDto } from './user.dto';
import { userPayload } from 'src/types/userPayload';
import { getUser } from '../auth/decorators/get.user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SANTRI, Role.ADMIN, Role.SUPERADMIN)
  @Get('getAll')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SANTRI, Role.ADMIN, Role.SUPERADMIN)
  @Post('create')
  async crateUser(@Body() data: createUSerDto) {
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

  @UseGuards(JwtAuthGuard)
  @Patch('/update/:userId')
  async editUser(
    @Param('userId') userId: string,
    @Body() data: createUSerDto,
    @getUser() user: userPayload,
  ) {
    return this.userService.editUser(userId, data, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/updatePassword/:userId')
  async updatePassword(
    @Param('userId') userId: string,
    @Body() data: UpdatePasswordDto,
    @getUser() user: userPayload,
  ) {
    return this.userService.updatePassword(userId, data, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SANTRI, Role.ADMIN, Role.SUPERADMIN)
  @Delete('/delete/:userId')
  async deletedUSerByAdmin(@Param('userId') userId: string) {
    return this.userService.deletedUser(userId);
  }
}
