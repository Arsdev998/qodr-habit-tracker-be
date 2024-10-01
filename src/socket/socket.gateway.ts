import { WebSocketGateway,WebSocketServer,SubscribeMessage,MessageBody } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway()
export class SocketGateway {
    @WebSocketServer()
    server: Server

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        this.server.emit('message',message)
    }
}