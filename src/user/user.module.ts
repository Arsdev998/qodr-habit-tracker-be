import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaModule } from "src/prisma_config/prisma.module";
import { UserController } from "./user.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService],
    exports:[UserService]
})

export class UserModule {}