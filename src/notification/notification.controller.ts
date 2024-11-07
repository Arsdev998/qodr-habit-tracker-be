import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post(':userId')
  @Post(':userId')
  async sendNotification(
    @Param('userId') userId: string, // Menangkap parameter userId sebagai string
    @Body('message') message: string, // Menangkap pesan dari request body
  ) {
    return this.notificationService.sendNotification(userId, message); // Konversi userId ke number
  }

  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: number) {
    return this.notificationService.findNotificationsByUserId(userId);
  }

  @Put(':id/read')
  async markNotificationAsRead(@Param('id') id: number) {
    return this.notificationService.markAsRead(id);
  }
}
