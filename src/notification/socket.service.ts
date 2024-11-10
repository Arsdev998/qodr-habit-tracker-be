import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  async sendToUser(userId: string, notification: any) {
    console.log('SocketService: Preparing to send notification');
    console.log('Notification data:', notification);
    console.log('Target userId:', userId);

    // Ensure the gateway is available
    if (!this.notificationGateway) {
      console.error('NotificationGateway is not initialized!');
      return;
    }

    try {
      await this.notificationGateway.sendNotificationToUser(
        userId,
        notification,
      );
      console.log('SocketService: Notification sent successfully');
    } catch (error) {
      console.error('SocketService: Error sending notification:', error);
    }
  }
}
