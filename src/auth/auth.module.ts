import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaModule } from "src/prisma_config/prisma.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports:[
        PrismaModule,
        PassportModule,
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: async (ConfigService: ConfigService)=>({
                secret: ConfigService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: '60m'
                }
            })
        })
    ],
    providers:[AuthService,JwtStrategy],
    exports:[AuthService]

})

export class AuthModule{}