// socket.service.ts
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private server: Server;

  constructor() {
    // Setup server saat aplikasi dimulai
    this.server = new Server();
  }

  sendToUser(userId: string, message: string) {
    // Kirim notifikasi ke user tertentu
    this.server.to(String(userId)).emit('notification', { message });
  }

  // Fungsi untuk memulai koneksi (akan dipanggil di main bootstrap)
  start(server: any) {
    this.server.attach(server);
  }
}
