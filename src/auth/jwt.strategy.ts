import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as (
        req: Request,
      ) => string | null,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY ?? 'DEFAULT_SECRET_KEY',
    });
  }

  validate(payload: JwtPayload): { userId: number; email: string } {
    return { userId: payload.sub, email: payload.email };
  }
}
