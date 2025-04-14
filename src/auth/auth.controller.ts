import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Res } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { email, password } = body;
    const { access_token, user } = await this.authService.login(
      email,
      password,
    );
    res.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: false, // Set to false in development
      sameSite: 'lax', // Allow cookies for cross-origin requests with navigation
    });
    return {
      message: 'Login successful',
      user,
    };
  }
  @Post('register')
  async register(
    @Body() body: { email: string; password: string; username: string }, // Add username to the request body,
  ): Promise<any> {
    const { email, password, username } = body;
    return this.authService.register(email, password, username);
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<any> {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false, // Set to false in development
      sameSite: 'lax', // Allow cookies for cross-origin requests with navigation
    });
    return {
      message: 'Logout successful',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { userId: number } }): any {
    try {
      if (!req.user || !req.user.userId) {
        throw new Error('User ID not found in request');
      }
      const id: number = req.user.userId;
      return this.authService.getUserProfile(id);
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      throw error;
    }
  }
}
