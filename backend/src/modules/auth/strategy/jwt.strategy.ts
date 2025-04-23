import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { Role } from 'src/utils/enums';
dotenv.config();

type PayloadDto = {
  id: number;
  email: string;
  role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadDto) {

    const userRole = payload.role; 

    console.log('JWT Payload:', payload);

    return {
      id: payload.id,
      email: payload.email,
      role: userRole,
    };
  }
}
