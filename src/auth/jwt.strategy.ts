import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
interface JwtPayload {
  sub: number;
  username: string;
  email?: string;
  role?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'qeqeqe',
    });
  }

  // this method is called when a request is made with a JWT
  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
// we will never quit
// we will never quit
