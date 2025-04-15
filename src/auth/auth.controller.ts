import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { access_token, user } = await this.authService.login(loginDto);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
    });

    return {
      message: 'Login successful',
      user,
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<any> {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
    });

    return {
      message: 'Logout successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: { userId: number } }): Promise<any> {
    const id = req.user?.userId;

    if (!id) {
      throw new Error('User ID not found in request');
    }

    return this.authService.getUserProfile(id);
  }
}
