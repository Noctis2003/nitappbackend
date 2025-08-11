// auth/auth.service.ts
// so what basically is happening 
// i am trying to implement a refresh logic for the JWT authentication
// the refresh endpoint will be hit 
// and now i must do one thing 
// 
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

    
getUserEmailDomain(email: string): string {
    return email.split('@')[1];
  }
  
async getUserProfile(userId: number) {
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    
    return user;
  }


  async validateRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      return { userId: user.id, email: user.email };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  generateJwt(user: any) {
    console.log('Generating JWT for user:', user);
    const payload = {
      sub: user.payload.userId,
      email: user.payload.email,
    };
    return this.jwtService.sign(payload);
  }
    generateJwt_2(user: any) {
    console.log('Generating JWT for user:', user);
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
// often one is forced to wonder what is the purpose of one's being
    async generateRefreshToken(user: any) {
    const payload = {
       sub: user.payload.userId,
      email: user.payload.email,
    };
    const refresh_token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      expiresIn: '7d', // Refresh token valid for 7 days
    });

    

    await this.prisma.user.update({
      where: { id: user.payload.userId },
      data: { refreshToken: refresh_token },
    });

    return refresh_token;
  }

  async generateRefreshToken_2(user: any) {
    const payload = {
       sub: user.userId,
      email: user.email,
    };
    const refresh_token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      expiresIn: '7d', // Refresh token valid for 7 days
    });

    

    await this.prisma.user.update({
      where: { id: user.payload.userId },
      data: { refreshToken: refresh_token },
    });

    return refresh_token;
  }
}
