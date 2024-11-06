import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma_config/prisma.module";
import { TilawahService } from "./tilawah.service";
import { TilawahController } from "./tilwah.controller";

@Module({
    imports: [PrismaModule],
    controllers:[TilawahController],
    providers:[TilawahService],
    exports:[TilawahService],
})


export class TilawahModule{}