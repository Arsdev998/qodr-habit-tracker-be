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
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private userSocketMap = new Map<string, Set<string>>();

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
    this.server = server;
  }

  handleConnection(client: Socket) {
    // Extract userId from the handshake query
    const userId = Array.isArray(client.handshake.query.userId)
      ? client.handshake.query.userId[0]
      : client.handshake.query.userId;
    // Check if userId is provided
    if (userId) {
      // Join the user to their specific room
      client.join(`user-${userId}`);

      // Initialize the userSocketMap for the user if it doesn't exist
      if (!this.userSocketMap.has(userId)) {
        this.userSocketMap.set(userId, new Set());
      }
      // Add the client ID to the user's socket set
      this.userSocketMap.get(userId).add(client.id);
      console.log(`User  ${userId} connected with socket id: ${client.id}`);
    } else {
      console.warn('No userId provided'); // Use console.warn for warnings
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketIds] of this.userSocketMap.entries()) {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        if (socketIds.size === 0) {
          this.userSocketMap.delete(userId);
        }
        this.logger.log(`Removed socket ${client.id} for user ${userId}`);
      }
    }
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
    try {
      this.logger.debug(`Attempting to send notification to user ${userId}`);
      this.logger.debug('Notification data:', notification);

      if (!this.server) {
        this.logger.error('WebSocket server is not initialized');
        return;
      }

      const roomName = `user-${userId}`;
      const sockets = await this.server.in(roomName).fetchSockets();

      this.logger.debug(
        `Found ${sockets.length} socket(s) in room ${roomName}`,
      );

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
