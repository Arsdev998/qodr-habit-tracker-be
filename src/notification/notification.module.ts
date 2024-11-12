import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationGateway } from "./notification.gateway";
import { NotificationController } from "./notification.controller";
import { PrismaModule } from "src/prisma_config/prisma.module";
import { SocketService } from "./socket.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports:[PrismaModule,AuthModule],
    controllers:[NotificationController],
    providers:[NotificationService,NotificationGateway,SocketService],
    exports:[NotificationService,SocketService,NotificationGateway],
})

export class NotificationModule{}