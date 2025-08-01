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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // initiates the Google OAuth2 login flow
  }


  



  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: ExpressRequest, @Res() res: Response) {
    const jwt = this.authService.generateJwt(req.user);
    res.cookie('access_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    const refreshToken = this.authService.generateRefreshToken(req.user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect('http://localhost:3000/featured/confessions'); // your frontend
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

  
  @Get('refresh')
  async refreshToken(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: Response): Promise<any> {
   const refreshToken = req.cookies['refresh_token'];
   if(!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }
    //
    const user = await this.authService.validateRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const newJwt = this.authService.generateJwt(user);
    res.cookie('access_token', newJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const newRefreshToken = this.authService.generateRefreshToken(user);
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: 'Tokens refreshed successfully' });
  }

}
