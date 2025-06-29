import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Req,
  Res,
  Query
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

interface CustomRequest extends ExpressRequest {
  cookies: { [key: string]: string }; // Add cookies property
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService, // Inject JwtService
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { access_token, refresh_token, user } =
      await this.authService.login(loginDto);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 604800000, // 7 days
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
    });
    await this.authService.updateRefreshToken(user.id, refresh_token);
    return {
      message: 'Login successful',
      user,
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Get('exists')
  async exists(@Query('email') email:string){
  return this.authService.exists(email);
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @Req() req) {
    const userId = req.user?.userId;
    res.clearCookie('jwt', {
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

  @Get('refresh')
  async refresh(
    @Req() req: CustomRequest, // Use the custom request type
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const refreshToken = req.cookies['refresh_token'];
    console.log('Refresh Token:', refreshToken); 
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: 'qeqeqe', // Ensure this matches your secret configuration
      });
      const isValid = await this.authService.verifyRefreshToken(
        refreshToken,
        payload.sub,
      );
      if (!isValid) {
        await this.authService.logout(payload.sub);
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
      const user = await this.authService.getUserById(payload.sub);
      // this part of code generates new tokens
      // and also rotates the refresh token
      const newTokens = await this.authService.generateTokens(
        user.id,
        user.email,
      );
      await this.authService.updateRefreshToken(
        user.id,
        newTokens.refresh_token,
      );

      res.cookie('jwt', newTokens.access_token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        secure: true, // Set to true in production with HTTPS
        sameSite: 'none',
      });

      res.cookie('refresh_token', newTokens.refresh_token, {
        httpOnly: true,
        maxAge: 604800000, // 7 days
        secure: true, // Set to true in production with HTTPS
        sameSite: 'none',
      });

      return {
        message: 'Token refreshed successfully',
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
      };
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
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
}
