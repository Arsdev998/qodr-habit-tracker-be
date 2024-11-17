import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/auth.types';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post(':userId')
  async sendNotification(
    @Param('userId') userId: string,
    @Body('message') message: string,
  ) {
    return this.notificationService.sendNotification(userId, message);
  }


  @Post('/sendAll/sendToAllUsers')
  async sendNotificationToAllUSer(@Body('message') message: string) {
    return this.notificationService.sendNotificationToAllUsers(message);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.findNotificationsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  async markNotificationAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/unread')
  async getNotifikasisUnread(@Param('userId') userId: string) {
    return this.notificationService.getUnreadNotifications(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/markreadmany/:userId')
  async markReadMany(@Param('userId') userId: string) {
    return this.notificationService.maskReadMany(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deletemany/:userId')
  async deleteNotificationMany(@Param('userId') userId: string) {
    return this.notificationService.deleteManyNotification(userId);
  }
}
