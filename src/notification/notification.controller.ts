import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/auth.types';
import { getUser } from 'src/auth/decorators/get.user.decorator';
import { userPayload } from 'src/types/userPayload';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.KESANTRIAN)
  @Post('/post/:userId')
  async sendNotification(
    @Param('userId') userId: string,
    @Body('message') message: string,
    @getUser() user: userPayload,
  ) {
    return this.notificationService.sendNotification(userId, message, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.KESANTRIAN)
  @Post('/sendAll/sendToAllUsers')
  async sendNotificationToAllUSer(
    @Body('message') message: string,
    @getUser() user: userPayload,
  ) {
    return this.notificationService.sendNotificationToAllUsers(
      message,
      user.sub,
    );
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
  @Delete('/deletemany/:userId')
  async deleteNotificationMany(@Param('userId') userId: string) {
    return this.notificationService.deleteManyNotification(userId);
  }


  @UseGuards(JwtAuthGuard)
  @Get('/get/all')
  async getNotificationsAndEvaluations(
    @getUser() user: userPayload,
    @Query('page') page: string,
    @Query('limit') limit: string ,
  ) {
     const pageNumber = parseInt(page, 10) || 1;
     const limitNumber = parseInt(limit, 10) || 10;
    return this.notificationService.getNotificationsAndEvaluations(
      user.sub,
      pageNumber,
      limitNumber,
    );
  }
}
