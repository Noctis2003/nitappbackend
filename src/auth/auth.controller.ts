import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<any> {
    const { email, password } = body;
    return this.authService.login(email, password);
  }
  @Post('register')
  async register(
    @Body() body: { email: string; password: string; username: string }, // Add username to the request body,
  ): Promise<any> {
    const { email, password, username } = body;
    return this.authService.register(email, password, username);
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
