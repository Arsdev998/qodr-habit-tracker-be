import { Module } from "@nestjs/common";
import { HabitService } from "./habit.service";
import { HabitController } from "./habit.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [HabitController],
    providers: [HabitService],
})

export class HabitModule{}