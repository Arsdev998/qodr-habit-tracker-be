import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaModule } from "src/prisma_config/prisma.module";
import { UserController } from "./user.controller";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService],
})

export class UserModule {}