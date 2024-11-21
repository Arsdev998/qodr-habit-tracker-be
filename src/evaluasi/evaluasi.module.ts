import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma_config/prisma.module";
import { EvaluationServices } from "./evaluasi.service";
import { EvaluationController } from "./evaluasi.controller";


@Module({
    imports:[PrismaModule, AuthModule],
    controllers:[EvaluationController],
    providers:[EvaluationServices]
})


export class EvaluationModule{}