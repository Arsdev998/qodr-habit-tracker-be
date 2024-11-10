import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { SocketService } from './socket.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private socketService: SocketService,
  ) {}

  async sendNotification(userId: string, message: string) {
    try {
      // Save notification to the database
      const notification = await this.prisma.notification.create({
        data: {
          userId: parseInt(userId),
          message: message,
          status: false,
        },
      });

      // Send complete notification via WebSocket
      await this.socketService.sendToUser(userId, {
        id: notification.id,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt,
      });

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error; // Ensure the error is thrown for further handling
    }
  }

  async findNotificationsByUserId(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id: parseInt(id) },
      data: { status: true },
    });
  }

  async getUnreadNotifications(userId: string) {
    return this.prisma.notification.count({
      where: { userId: parseInt(userId), status: false }, // Status belum dibaca
    });
  }
}
