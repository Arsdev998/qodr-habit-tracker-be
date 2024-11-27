import { Module } from "@nestjs/common";
import { AdminDashboardController } from "./admin.controller";
import { AdminServices } from "./admin.service";
import { PrismaModule } from "src/prisma_config/prisma.module";

@Module({
    imports:[PrismaModule],
    controllers:[AdminDashboardController],
    providers:[AdminServices],
})

export class AdminDashboardModule{}