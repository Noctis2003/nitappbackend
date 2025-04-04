import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import AuthService from './auth.service';
interface JwtPayload {
  sub: string;
  username: string;
  email?: string;
  role?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // this method is called when a request is made with a JWT
  async validate(payload: JwtPayload) {
    try {
      const user = await this.authService.validateUser(payload.sub, payload.username);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { userId: user.id, username: user.username };
    } catch (error) {
      throw new UnauthorizedException(`Validation failed: ${error.message}`);
    }
  }
}
// we will never quit
// we will never quit
