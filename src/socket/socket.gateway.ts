import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/notification',
})
export class SocketGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateWay.name);
  private userSocketMap: Map<string, Set<string>> = new Map();

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    try {
      const userId = this.extractUserId(client);

      if (!userId) {
        client.disconnect();
        return;
      }

      const roomName = `user-${userId}`;

      // Join room
      client.join(roomName);

      // Track socket
      if (!this.userSocketMap.has(userId)) {
        this.userSocketMap.set(userId, new Set());
      }
      this.userSocketMap.get(userId).add(client.id);

      this.logger.log(
        `Client connected - Socket ID: ${client.id}, User ID: ${userId}`,
      );
      this.logger.debug(`Current rooms for socket ${client.id}:`, [
        ...client.rooms,
      ]);

      // Emit success connection event
      client.emit('connect_success', {
        status: 'connected',
        socketId: client.id,
        userId: userId,
      });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const userId = this.extractUserId(client);
      if (userId) {
        const userSockets = this.userSocketMap.get(userId);
        if (userSockets) {
          userSockets.delete(client.id);
          if (userSockets.size === 0) {
            this.userSocketMap.delete(userId);
          }
        }
        this.logger.log(
          `Client disconnected - Socket ID: ${client.id}, User ID: ${userId}`,
        );
      }
    } catch (error) {
      this.logger.error(`Disconnect error: ${error.message}`);
    }
  }

  private extractUserId(client: Socket): string | null {
    const userId = client.handshake.query.userId;
    return Array.isArray(userId) ? userId[0] : userId;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, userId: string) {
    this.logger.debug(`Join room request received for user ${userId}`);

    try {
      // Ensure we have a Set for this user
      if (!this.userSocketMap.has(userId)) {
        this.userSocketMap.set(userId, new Set());
      }

      const userSocketIds = this.userSocketMap.get(userId);
      userSocketIds.add(client.id);

      // Join the room
      const roomName = `user-${userId}`;
      client.join(roomName);

      this.logger.log(
        `User ${userId} joined room ${roomName} with socket ${client.id}`,
      );
      this.logger.log(
        `Current connections for user ${userId}: ${userSocketIds.size}`,
      );

      // Send confirmation
      client.emit('joinedRoom', {
        userId,
        socketId: client.id,
        roomName,
      });

      return { success: true, message: 'Joined room successfully' };
    } catch (error) {
      this.logger.error(
        `Error in handleJoinRoom: ${error.message}`,
        error.stack,
      );
      return { success: false, error: error.message };
    }
  }

  async sendNotificationToUser(userId: string, notification: any) {
    this.logger.debug(`Attempting to send notification to user ${userId}`);
    this.logger.debug('Notification data:', notification);
    try {
      if (!this.server) {
        this.logger.error('WebSocket server is not initialized');
        return;
      }
      const roomName = `user-${userId}`;
      const sockets = await this.server.in(roomName).fetchSockets();
      this.logger.debug(
        `Found ${sockets.length} socket(s) in room ${roomName}`,
      );
      console.log('socket log', sockets);
      if (sockets.length > 0) {
        await this.server.to(roomName).emit('notification', notification);
        this.logger.log(`Notification sent to room ${roomName}`);
      } else {
        this.logger.warn(`No active sockets found in room ${roomName}`);
      }
    } catch (error) {
      this.logger.error(
        `Error sending notification to user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  getUserConnections(userId: string): number {
    const socketIds = this.userSocketMap.get(userId);
    return socketIds ? socketIds.size : 0;
  }
}
