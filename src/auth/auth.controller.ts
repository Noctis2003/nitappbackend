// auth/auth.controller.ts
// here we have to implement a refersh token logic

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Query,
  Request, // same thing as express Request // just less type safe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from  './jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // initiates the Google OAuth2 login flow
  }


  



  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: ExpressRequest, @Res() res: Response) {
   
    const jwt = await this.authService.generateJwt(req.user);
    res.cookie('access_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    // noctis is back
    const refreshToken = await this.authService.generateRefreshToken(req.user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.redirect(`${process.env.FRONTEND_URL}/featured/confessions`); // your frontend
  }



 @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @Req() req) {
  
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true, // Set to true in production
      sameSite: 'none',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true, // Set to true in production
      sameSite: 'none',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('email')
  async getDomain(
    @Request() req: { user: { userId: number; email: string } },
  ): Promise<any> {
    const id = req.user?.userId;
    const email = req.user?.email;
    return this.authService.getUserEmailDomain(email);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(
    @Request() req: { user: { userId: number } },
  ): Promise<any> {
    const id = req.user?.userId;
    return this.authService.getUserProfile(id);
  }

  // search the db for refresh token
  // once you are unable to get it you throw an error
  // if you are able to get it you update it
  // and give yourself a token )both access and refresh token
  @Get('refresh')
async refreshToken(
  @Req() req: ExpressRequest,
  @Res({ passthrough: true }) res: Response
) {
  const refreshToken = req.cookies['refresh_token'];
  if (!refreshToken) {
    throw new UnauthorizedException('Refresh token not found');
  }

  const user = await this.prisma.user.findFirst({ where: { refreshToken } });
  if (!user) {
    throw new UnauthorizedException('Invalid refresh token');
  }
  console.log(user)
  const newJwt = this.authService.generateJwt_2(user);
  res.cookie('access_token', newJwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    });
    // noctis is back
   const newRefreshToken = await this.authService.generateRefreshToken_2(user);
  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });


  return { message: 'Tokens refreshed successfully' };
}
}
