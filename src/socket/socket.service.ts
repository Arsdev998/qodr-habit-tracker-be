import { Injectable } from '@nestjs/common';
import { SocketGateWay } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly socketGateway: SocketGateWay) {}

  async sendToUser(userId: string, notification: any) {
    // Ensure the gateway is available
    if (!this.socketGateway) {
      console.error('NotificationGateway is not initialized!');
      return;
    }

    try {
      await this.socketGateway.sendNotificationToUser(
        userId,
        notification,
      );
      console.log('SocketService: Notification sent successfully');
    } catch (error) {
      console.error('SocketService: Error sending notification:', error);
    }
  }
}
