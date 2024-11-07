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
    // Simpan notifikasi ke database
    const notification = await this.prisma.notification.create({
      data: {
        userId: parseInt(userId),
        message:message,
        status: false, // Status belum dibaca
      },
    });

    // Kirim notifikasi melalui WebSocket
    this.socketService.sendToUser(userId, message); // Kirim melalui socket ke user tertentu

    return notification;
  }

  async findNotificationsByUserId(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { status: true },
    });
  }
}
