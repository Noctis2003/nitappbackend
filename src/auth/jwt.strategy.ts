import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express'; // Import Request type
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
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.jwt; // Extract JWT from cookies
        },
      ]),
      ignoreExpiration: false, // Ensure expired tokens are rejected
      secretOrKey: 'qeqeqe', // Use the secret key for JWT validation
    });
  }

  // This method is called when a request is made with a JWT
  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
