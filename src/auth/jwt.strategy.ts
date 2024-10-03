import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    console.log('JwtStrategy initialized');
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload); // Log payload JWT
    return { userId: payload.sub, name: payload.name, role: payload.role };
  }
}

