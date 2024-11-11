import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma_config/prisma.service';
import { SocketService } from './socket.service';

interface NotificationData {
  id: number;
  message: string;
  status: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

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
      const notificationData: NotificationData = {
        id: notification.id,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt,
      };
      // Send notification via WebSocket with retry mechanism
      try {
        await this.socketService.sendToUser(userId, notificationData);
      } catch (socketError) {
        this.logger.warn(
          `Failed to send notification via WebSocket to user ${userId}: ${socketError.message}`,
          socketError.stack,
        );
        // Note: We don't throw here as the notification is already saved in DB
      }

      return notification;
    } catch (error) {
      this.logger.error(
        `Error in sendNotification for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  async findNotificationsByUserId(userId: string) {
    try {
      return await this.prisma.notification.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching notifications for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  async markAsRead(id: string) {
    try {
      const notification = await this.prisma.notification.update({
        where: { id: parseInt(id)},
        data: { status: true },
      });
      // Optionally notify connected clients about the status change
      if (notification) {
        try {
          await this.socketService.sendToUser(notification.userId.toString(), {
            type: 'notification_status_update',
            id: notification.id,
            status: true,
          });
        } catch (socketError) {
          this.logger.warn(
            `Failed to send status update via WebSocket: ${socketError.message}`,
          );
        }
      }

      return notification;
    } catch (error) {
      this.logger.error(
        `Error marking notification ${id} as read:`,
        error.stack,
      );
      throw error;
    }
  }

  async maskReadMany(userId:string) {
    try {
      await this.prisma.notification.updateMany({
        where:{
          userId: parseInt(userId),
          status:false
        },
        data: {
          status: true,
        },
      });
      return {message:"All notification mask read"}
    } catch (error) {
      throw error
    }
  }

  async getUnreadNotifications(userId: string) {
    try {
      return await this.prisma.notification.count({
        where: {
          userId: parseInt(userId),
          status: false,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error counting unread notifications for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  // New method to get notifications with pagination
  async getNotificationsWithPagination(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        this.prisma.notification.findMany({
          where: { userId: parseInt(userId) },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.notification.count({
          where: { userId: parseInt(userId) },
        }),
      ]);

      return {
        data: notifications,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(
        `Error fetching paginated notifications for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  // New method to mark multiple notifications as read
  async markMultipleAsRead(userId: string, notificationIds: string[]) {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          id: { in: notificationIds.map((id) => parseInt(id)) },
          userId: parseInt(userId),
        },
        data: { status: true },
      });

      if (result.count > 0) {
        try {
          await this.socketService.sendToUser(userId, {
            type: 'notifications_status_update',
            ids: notificationIds,
            status: true,
          });
        } catch (socketError) {
          this.logger.warn(
            `Failed to send bulk status update via WebSocket: ${socketError.message}`,
          );
        }
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Error marking multiple notifications as read for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }
}
