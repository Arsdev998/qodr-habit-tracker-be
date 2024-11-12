import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma_config/prisma.module";
import { TilawahService } from "./tilawah.service";
import { TilawahController } from "./tilwah.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [PrismaModule,AuthModule],
    controllers:[TilawahController],
    providers:[TilawahService],
    exports:[TilawahService],
})


export class TilawahModule{}