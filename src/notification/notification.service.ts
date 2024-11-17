import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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

  async sendNotificationToAllUsers(message: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          role: 'SANTRI',
        },
        select: {
          id: true,
        },
      });

      this.logger.log(`Sending notification to ${users.length} users...`);

      console.log('users', users);

      if (users.length === 0) {
        throw new HttpException('No user found', HttpStatus.NOT_FOUND);
      }

      // Create notifications in bulk
      const notifications = await this.prisma.notification.createMany({
        data: users.map((user) => ({
          userId: user.id,
          message: message,
          status: false,
        })),
      });

      // Retrieve the notifications that were just created
      const createdNotifications = await this.prisma.notification.findMany({
        where: {
          message: message,
          createdAt: {
            gte: new Date(Date.now() - 1000), // Adjust the time range as necessary
          },
        },
        include: {
          user: true, 
        },
      });

      // Send notifications in batches
      const batchSize = 50;
      for (let i = 0; i < users.length; i += batchSize) {
        const userBatch = users.slice(i, i + batchSize);
        await Promise.all(
          userBatch.map(async (user) => {
            const userNotification = createdNotifications.find(
              (n) => n.userId === user.id,
            );

            if (!userNotification) return;

            const notificationData: NotificationData = {
              id: userNotification.id,
              message: userNotification.message,
              status: userNotification.status,
              createdAt: userNotification.createdAt,
            };

            try {
              await this.socketService.sendToUser(
                user.id.toString(),
                notificationData,
              );
            } catch (socketError) {
              this.logger.warn(
                `Failed to send notification via WebSocket to user ${user.id}: ${socketError.message}`,
                socketError.stack,
              );
            }
          }),
        );
      }

      return {
        success: true,
        totalNotifications: notifications.count,
        message: 'Notifications sent successfully',
      };
    } catch (error) {
      this.logger.error('Error in sendNotificationToAllUsers:', error.stack);
      throw new Error('Failed to send notifications to all users');
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
        where: { id: parseInt(id) },
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

  async maskReadMany(userId: string) {
    try {
      await this.prisma.notification.updateMany({
        where: {
          userId: parseInt(userId),
          status: false,
        },
        data: {
          status: true,
        },
      });
      return { message: 'All notification mask read' };
    } catch (error) {
      throw error;
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
  async deleteManyNotification(userId: string) {
    try {
      const deleteResult = this.prisma.notification.deleteMany({
        where: {
          userId: parseInt(userId),
        },
      });

      if ((await deleteResult).count === 0) {
        throw new HttpException('No notification found', HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Notification deleted succesfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
